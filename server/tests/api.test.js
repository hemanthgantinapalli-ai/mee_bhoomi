const assert = require('assert');
const CaptchaService = require('../services/captchaService');
const authController = require('../controllers/authController');
const recordController = require('../controllers/recordController');
const districtController = require('../controllers/districtController');
const { validateSearchInput } = require('../middleware/validator');
const { getVillageAdangal, getVillage1B } = recordController;
const { inMemoryData, upsertMissing } = require('../seeds/seedData');

process.env.NODE_ENV = 'test';
process.env.CAPTCHA_SECRET = 'test_secret_key_123';
process.env.ALLOW_DEMO_OTP = 'false';

console.log('--- Starting MeeBhoomi API & Captcha Test Suite ---');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      failed++;
    }
  }

  await testAsync('Authentication: generated OTP is random, matched, and single-use', async () => {
    const makeResponse = () => ({
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    });
    const sendResponse = makeResponse();

    authController.sendOtp({
      body: { loginType: 'Citizen', mobileNumber: '9876543210' }
    }, sendResponse);

    assert.strictEqual(sendResponse.statusCode, 200);
    assert.match(sendResponse.body.demoOtp, /^\d{6}$/);

    const wrongOtp = sendResponse.body.demoOtp === '000000' ? '000001' : '000000';
    const invalidResponse = makeResponse();
    authController.verifyOtp({
      body: { mobileNumber: '9876543210', otp: wrongOtp }
    }, invalidResponse);
    assert.strictEqual(invalidResponse.statusCode, 400);

    const validResponse = makeResponse();
    authController.verifyOtp({
      body: { mobileNumber: '9876543210', otp: sendResponse.body.demoOtp }
    }, validResponse);
    assert.strictEqual(validResponse.statusCode, 200);
    assert.strictEqual(validResponse.body.success, true);

    const replayResponse = makeResponse();
    authController.verifyOtp({
      body: { mobileNumber: '9876543210', otp: sendResponse.body.demoOtp }
    }, replayResponse);
    assert.strictEqual(replayResponse.statusCode, 400);
  });

  await testAsync('Authentication: development demo accepts any six digits without revealing an OTP', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    try {
      authController.sendOtp({
        body: { loginType: 'Citizen', mobileNumber: '9876543210' }
      }, response);
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(Object.hasOwn(response.body, 'demoOtp'), false);

      const loginResponse = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.body = payload;
          return this;
        }
      };
      authController.verifyOtp({
        body: { mobileNumber: '9876543210', otp: '123456' }
      }, loginResponse);
      assert.strictEqual(loginResponse.statusCode, 200);
      assert.strictEqual(loginResponse.body.success, true);

      const invalidResponse = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.body = payload;
          return this;
        }
      };
      authController.verifyOtp({
        body: { mobileNumber: '9876543210', otp: '12345x' }
      }, invalidResponse);
      assert.strictEqual(invalidResponse.statusCode, 400);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  await testAsync('Authentication: production demo login requires explicit opt-in', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousDemoOtpSetting = process.env.ALLOW_DEMO_OTP;
    const makeResponse = () => ({
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    });

    try {
      process.env.NODE_ENV = 'production';
      process.env.ALLOW_DEMO_OTP = 'false';
      const sendResponse = makeResponse();
      authController.sendOtp({
        body: { loginType: 'Citizen', mobileNumber: '9876543210' }
      }, sendResponse);
      assert.match(sendResponse.body.demoOtp, /^\d{6}$/);

      const deniedResponse = makeResponse();
      authController.verifyOtp({
        body: { mobileNumber: '9876543210', otp: '123456' }
      }, deniedResponse);
      assert.strictEqual(deniedResponse.statusCode, 400);

      process.env.ALLOW_DEMO_OTP = 'true';
      const demoSendResponse = makeResponse();
      authController.sendOtp({
        body: { loginType: 'Citizen', mobileNumber: '9876543210' }
      }, demoSendResponse);
      assert.strictEqual(Object.hasOwn(demoSendResponse.body, 'demoOtp'), false);

      const demoVerifyResponse = makeResponse();
      authController.verifyOtp({
        body: { mobileNumber: '9876543210', otp: '654321' }
      }, demoVerifyResponse);
      assert.strictEqual(demoVerifyResponse.statusCode, 200);
      assert.strictEqual(demoVerifyResponse.body.success, true);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      process.env.ALLOW_DEMO_OTP = previousDemoOtpSetting;
    }
  });

  // 1. CAPTCHA Tests
  test('CAPTCHA: generates valid SVG and cryptographic token', () => {
    const challenge = CaptchaService.createChallenge();
    assert(challenge.token, 'Token must exist');
    assert(challenge.svg.includes('<svg'), 'SVG markup must be returned');
    assert(challenge.expiresAt > Date.now(), 'Expiration must be in future');
  });

  test('CAPTCHA: accepts valid answer and rejects duplicate reuse', () => {
    const challenge = CaptchaService.createChallenge();
    assert(challenge.testCode, 'Test code must be provided in test environment');
    
    // First verification: should succeed
    const res1 = CaptchaService.verifyChallenge(challenge.token, challenge.testCode);
    assert.strictEqual(res1.success, true, 'Valid code should pass verification');

    // Second verification with same token: should fail (one-time use)
    const res2 = CaptchaService.verifyChallenge(challenge.token, challenge.testCode);
    assert.strictEqual(res2.success, false, 'Reused captcha token must be rejected');
    assert(res2.message.includes('already been used'), 'Message must indicate reused status');
  });

  test('CAPTCHA: rejects incorrect answer', () => {
    const challenge = CaptchaService.createChallenge();
    const res = CaptchaService.verifyChallenge(challenge.token, 'WRONG_CODE');
    assert.strictEqual(res.success, false, 'Incorrect answer must fail');
    assert(res.message.includes('Incorrect captcha code'), 'Must provide clear failure message');
  });

  test('CAPTCHA: rejects missing token and answer', () => {
    const res1 = CaptchaService.verifyChallenge('', 'ABC');
    assert.strictEqual(res1.success, false, 'Missing token must fail');

    const challenge = CaptchaService.createChallenge();
    const res2 = CaptchaService.verifyChallenge(challenge.token, '');
    assert.strictEqual(res2.success, false, 'Empty answer must fail');
  });

  // 2. Hierarchy Data Tests
  test('Hierarchy: Guntur district and Mandals correctly resolved', () => {
    const guntur = inMemoryData.districts.find(d => d.code === '07');
    assert(guntur, 'Guntur district must exist in seed');
    assert.strictEqual(guntur.nameEn, 'Guntur');
    assert.strictEqual(guntur.nameTe, 'గుంటూరు');

    const mangalagiriMandal = inMemoryData.mandals.find(m => m.districtCode === '07' && m.nameEn === 'Mangalagiri');
    assert(mangalagiriMandal, 'Mangalagiri mandal must belong to Guntur');
  });

  await testAsync('Hierarchy: Rayapudi is available in Thullur village options', async () => {
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await districtController.getVillages({
      query: { districtCode: '07', mandalCode: '720' }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert(response.body.data.some(village =>
      village.code === '72005' &&
      village.nameEn === 'Rayapudi' &&
      village.nameTe === 'రాయపూడి'
    ));
  });

  // 3. Search Query Tests
  test('Records: Survey No search in Chinakakani village', () => {
    const records = inMemoryData.records.filter(r => 
      r.districtCode === '07' && 
      r.villageCode === '070104' && 
      r.surveyNo === '125'
    );
    assert(records.length >= 2, 'Should find survey sub-divisions for survey 125');
    assert.strictEqual(records[0].pattadarNameEn, 'Kollipara Venkata Subbarao');
    assert.strictEqual(records[0].khataNo, '102');
  });

  test('Records: Khata search correctly identifies Pattadar holding', () => {
    const record = inMemoryData.records.find(r => r.khataNo === '315');
    assert(record, 'Khata 315 must exist');
    assert.strictEqual(record.pattadarNameEn, 'Guntupalli Lakshmi Devi');
    assert.strictEqual(record.landClassification, 'Dry (మెట్ట)');
  });

  await testAsync('Records: Khata 461 returns the Rayapudi report details', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '720',
        villageCode: '72005',
        searchType: 'khataNo',
        searchValue: '461',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.count, 1);
    assert.deepStrictEqual(
      {
        districtNameEn: response.body.data[0].districtNameEn,
        mandalNameEn: response.body.data[0].mandalNameEn,
        villageNameEn: response.body.data[0].villageNameEn,
        pattadarNameTe: response.body.data[0].pattadarNameTe,
        fatherOrHusbandNameTe: response.body.data[0].fatherOrHusbandNameTe,
        surveyNo: response.body.data[0].surveyNo,
        subDivisionNo: response.body.data[0].subDivisionNo,
        khataNo: response.body.data[0].khataNo,
        totalExtentAcres: response.body.data[0].totalExtentAcres
      },
      {
        districtNameEn: 'Guntur',
        mandalNameEn: 'Thullur',
        villageNameEn: 'Rayapudi',
        pattadarNameTe: 'ఎం. నాగరాజు',
        fatherOrHusbandNameTe: 'రమేష్',
        surveyNo: '378',
        subDivisionNo: '1-B',
        khataNo: '461',
        totalExtentAcres: 2.70
      }
    );
  });

  await testAsync('Records: record detail responses never expose Aadhaar last four digits', async () => {
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.getRecordById({
      params: { id: '102' }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(Object.hasOwn(response.body.data, 'aadhaarLast4'), false);
  });

  await testAsync('Records: Aadhaar last-four lookup returns the linked demo Khata', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'aadhaar',
        searchValue: '4321',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.data.length, 1);
    assert.strictEqual(response.body.data[0].khataNo, '102');
    assert.strictEqual(Object.hasOwn(response.body.data[0], 'aadhaarLast4'), false);
  });

  await testAsync('Records: Aadhaar search rejects full numbers and values other than 4 digits', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'aadhaar',
        searchValue: '123456789012',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 400);
    assert.match(response.body.message, /only the last 4 digits/);
  });

  await testAsync('Records: search results are scoped to all selected location codes', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'surveyNo',
        searchValue: '125/1',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.count, 1);
    assert(response.body.data.every(record =>
      record.districtCode === '07' &&
      record.mandalCode === '0701' &&
      record.villageCode === '070104'
    ));
  });

  await testAsync('Records: rejects village codes outside the selected district and mandal', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '06',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'surveyNo',
        searchValue: '125/1',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 400);
    assert.match(response.body.message, /does not belong/);
  });

  await testAsync('Records: returns an empty result for a valid village without matching records', async () => {
    const challenge = CaptchaService.createChallenge();
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070102',
        searchType: 'surveyNo',
        searchValue: '125/1',
        captchaToken: challenge.token,
        captchaAnswer: challenge.testCode
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.count, 0);
    assert.deepStrictEqual(response.body.data, []);
  });

  await testAsync('Records: village Adangal and 1-B return only the selected village records', async () => {
    const callVillageEndpoint = async (controller) => {
      const challenge = CaptchaService.createChallenge();
      const expectedRecords = inMemoryData.records.filter(record =>
        record.districtCode === '07' &&
        record.mandalCode === '0701' &&
        record.villageCode === '070104'
      );
      const response = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.body = payload;
          return this;
        }
      };

      await controller({
        query: {
          districtCode: '07',
          mandalCode: '0701',
          villageCode: '070104',
          captchaToken: challenge.token,
          captchaAnswer: challenge.testCode
        }
      }, response, (error) => {
        throw error;
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.count, expectedRecords.length);
      assert(expectedRecords.length > 0);
      assert(response.body.data.every(record =>
        record.districtCode === '07' &&
        record.mandalCode === '0701' &&
        record.villageCode === '070104'
      ));
    };

    await callVillageEndpoint(getVillageAdangal);
    await callVillageEndpoint(getVillage1B);
  });

  test('Validation: rejects unknown record search types', () => {
    let responsePayload;
    const response = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        responsePayload = payload;
        return this;
      }
    };

    validateSearchInput({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'unexpected',
        searchValue: '125'
      }
    }, response, () => {
      throw new Error('Invalid search type should not pass validation.');
    });

    assert.strictEqual(response.statusCode, 400);
    assert.match(responsePayload.message, /Invalid search type/);
  });

  await testAsync('Seeding: reruns use insert-only upserts and preserve existing documents', async () => {
    let operations;
    let options;
    const fakeModel = {
      async bulkWrite(nextOperations, nextOptions) {
        operations = nextOperations;
        options = nextOptions;
      }
    };
    const seedDocuments = [
      { districtCode: '07', code: '0701', nameEn: 'Mangalagiri' }
    ];

    await upsertMissing(fakeModel, seedDocuments, ['districtCode', 'code']);

    assert.strictEqual(operations.length, 1);
    assert.deepStrictEqual(operations[0].updateOne.filter, {
      districtCode: '07',
      code: '0701'
    });
    assert.deepStrictEqual(operations[0].updateOne.update, {
      $setOnInsert: seedDocuments[0]
    });
    assert.strictEqual(operations[0].updateOne.upsert, true);
    assert.strictEqual(options.ordered, true);
  });

  await testAsync('Records: client cannot bypass server CAPTCHA verification', async () => {
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    await recordController.searchRecords({
      body: {
        districtCode: '07',
        mandalCode: '0701',
        villageCode: '070104',
        searchType: 'khataNo',
        searchValue: '102',
        bypassCaptcha: true
      }
    }, response, (error) => {
      throw error;
    });

    assert.strictEqual(response.statusCode, 400);
    assert.match(response.body.message, /Captcha code is required/);
  });

  test('Application Tracking: Status retrieval for valid Application ID', () => {
    const app = inMemoryData.applications.find(a => a.applicationNo === 'MUT2026AP009412');
    assert(app, 'Application MUT2026AP009412 must exist');
    assert.strictEqual(app.currentStatus, 'Approved');
  });

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('All backend test assertions passed successfully!');
    process.exit(0);
  }
}

runTests();
