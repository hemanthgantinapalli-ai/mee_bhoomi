const District = require('../models/District');
const Mandal = require('../models/Mandal');
const Village = require('../models/Village');
const LandRecord = require('../models/LandRecord');
const ApplicationStatus = require('../models/ApplicationStatus');
const mongoose = require('mongoose');

const seedDistricts = [
  { code: '07', nameEn: 'Guntur', nameTe: 'గుంటూరు', headquarters: 'Guntur' },
  { code: '06', nameEn: 'Krishna', nameTe: 'కృష్ణా', headquarters: 'Machilipatnam' },
  { code: '03', nameEn: 'Visakhapatnam', nameTe: 'విశాఖపట్నం', headquarters: 'Visakhapatnam' },
  { code: '10', nameEn: 'Chittoor', nameTe: 'చిత్తూరు', headquarters: 'Chittoor' },
  { code: '04', nameEn: 'East Godavari', nameTe: 'తూర్పు గోదావరి', headquarters: 'Rajamahendravaram' },
  { code: '13', nameEn: 'Kurnool', nameTe: 'కర్నూలు', headquarters: 'Kurnool' },
  { code: '11', nameEn: 'YSR Kadapa', nameTe: 'వైఎస్ఆర్ కడప', headquarters: 'Kadapa' },
  { code: '09', nameEn: 'Nellore', nameTe: 'నెల్లూరు', headquarters: 'Nellore' }
];

const seedMandals = [
  // Guntur
  { code: '0701', districtCode: '07', nameEn: 'Mangalagiri', nameTe: 'మంగళగిరి' },
  { code: '0702', districtCode: '07', nameEn: 'Tenali', nameTe: 'తెనాలి' },
  { code: '0703', districtCode: '07', nameEn: 'Tadikonda', nameTe: 'తాడికొండ' },
  { code: '0704', districtCode: '07', nameEn: 'Amaravati', nameTe: 'అమరావతి' },
  { code: '0705', districtCode: '07', nameEn: 'Guntur Urban', nameTe: 'గుంటూరు అర్బన్' },
  // Krishna
  { code: '0601', districtCode: '06', nameEn: 'Vijayawada Rural', nameTe: 'విజయవాడ రూరల్' },
  { code: '0602', districtCode: '06', nameEn: 'Gannavaram', nameTe: 'గన్నవరం' },
  { code: '0603', districtCode: '06', nameEn: 'Gudivada', nameTe: 'గుడివాడ' },
  // Visakhapatnam
  { code: '0301', districtCode: '03', nameEn: 'Anandapuram', nameTe: 'ఆనందపురం' },
  { code: '0302', districtCode: '03', nameEn: 'Bheemunipatnam', nameTe: 'భీమునిపట్నం' },
  // Chittoor
  { code: '1001', districtCode: '10', nameEn: 'Tirupati Urban', nameTe: 'తిరుపతి అర్బన్' },
  { code: '1002', districtCode: '10', nameEn: 'Chandragiri', nameTe: 'చంద్రగిరి' }
];

const seedVillages = [
  // Mangalagiri (0701)
  { code: '070101', mandalCode: '0701', districtCode: '07', nameEn: 'Mangalagiri', nameTe: 'మంగళగిరి', censusCode: '587601' },
  { code: '070102', mandalCode: '0701', districtCode: '07', nameEn: 'Atmakuru', nameTe: 'ఆత్మకూరు', censusCode: '587602' },
  { code: '070103', mandalCode: '0701', districtCode: '07', nameEn: 'Nutakki', nameTe: 'నూతక్కి', censusCode: '587603' },
  { code: '070104', mandalCode: '0701', districtCode: '07', nameEn: 'Chinakakani', nameTe: 'చినకాకాని', censusCode: '587604' },
  { code: '070105', mandalCode: '0701', districtCode: '07', nameEn: 'Nowluru', nameTe: 'నవులూరు', censusCode: '587605' },
  // Tenali (0702)
  { code: '070201', mandalCode: '0702', districtCode: '07', nameEn: 'Pinapadu', nameTe: 'పినపాడు', censusCode: '587610' },
  { code: '070202', mandalCode: '0702', districtCode: '07', nameEn: 'Kolakaluru', nameTe: 'కొలకలూరు', censusCode: '587611' },
  // Vijayawada Rural (0601)
  { code: '060101', mandalCode: '0601', districtCode: '06', nameEn: 'Nunna', nameTe: 'నున్నా', censusCode: '586501' },
  { code: '060102', mandalCode: '0601', districtCode: '06', nameEn: 'Gollapudi', nameTe: 'గొల్లపూడి', censusCode: '586502' },
  { code: '060103', mandalCode: '0601', districtCode: '06', nameEn: 'Enikepadu', nameTe: 'ఏనికేపాడు', censusCode: '586503' },
  // Anandapuram (0301)
  { code: '030101', mandalCode: '0301', districtCode: '03', nameEn: 'Anandapuram', nameTe: 'ఆనందపురం', censusCode: '583101' },
  { code: '030102', mandalCode: '0301', districtCode: '03', nameEn: 'Gambheeram', nameTe: 'గంభీరం', censusCode: '583102' }
];

const seedRecords = [
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '0701',
    mandalNameEn: 'Mangalagiri',
    mandalNameTe: 'మంగళగిరి',
    villageCode: '070104',
    villageNameEn: 'Chinakakani',
    villageNameTe: 'చినకాకాని',
    surveyNo: '125',
    subDivisionNo: '1',
    lpNo: 'LP/07/0701/125-1',
    khataNo: '102',
    pattadarNameEn: 'Kollipara Venkata Subbarao',
    pattadarNameTe: 'కొల్లిపర వెంకట సుబ్బారావు',
    fatherOrHusbandNameEn: 'Kollipara Ramaswamy',
    fatherOrHusbandNameTe: 'కొల్లిపర రామస్వామి',
    cultivatorNameEn: 'Self / Kollipara Venkata Subbarao',
    cultivatorNameTe: 'స్వయంగా / కొల్లిపర వెంకట సుబ్బారావు',
    totalExtentAcres: 2.45,
    cultivableExtentAcres: 2.45,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Wet (మాగాణి)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Krishna Canal Ayacut (కృష్ణా కాలువ)',
    cropDetails: 'Paddy (వరి)',
    aadhaarSeeded: true,
    aadhaarLast4: '4321',
    passbookNumber: 'AP/PPB/2023/070104-102',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '124', south: '126/1', east: '125/2', west: '120' }
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '0701',
    mandalNameEn: 'Mangalagiri',
    mandalNameTe: 'మంగళగిరి',
    villageCode: '070104',
    villageNameEn: 'Chinakakani',
    villageNameTe: 'చినకాకాని',
    surveyNo: '125',
    subDivisionNo: '2',
    lpNo: 'LP/07/0701/125-2',
    khataNo: '204',
    pattadarNameEn: 'Boddu Sambasiva Rao',
    pattadarNameTe: 'బొడ్డు సాంబశివరావు',
    fatherOrHusbandNameEn: 'Boddu Venkata Ratnam',
    fatherOrHusbandNameTe: 'బొడ్డు వెంకట రత్నం',
    cultivatorNameEn: 'Self / Boddu Sambasiva Rao',
    cultivatorNameTe: 'స్వయంగా / బొడ్డు సాంబశివరావు',
    totalExtentAcres: 1.80,
    cultivableExtentAcres: 1.80,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Wet (మాగాణి)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Krishna Canal (కృష్ణా కాలువ)',
    cropDetails: 'Black Gram / Paddy (మినుము / వరి)',
    aadhaarSeeded: true,
    aadhaarLast4: '8812',
    passbookNumber: 'AP/PPB/2023/070104-204',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '124', south: '126/2', east: '127', west: '125/1' }
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '0701',
    mandalNameEn: 'Mangalagiri',
    mandalNameTe: 'మంగళగిరి',
    villageCode: '070104',
    villageNameEn: 'Chinakakani',
    villageNameTe: 'చినకాకాని',
    surveyNo: '48',
    subDivisionNo: '3',
    lpNo: 'LP/07/0701/48-3',
    khataNo: '315',
    pattadarNameEn: 'Guntupalli Lakshmi Devi',
    pattadarNameTe: 'గుంటుపల్లి లక్ష్మీదేవి',
    fatherOrHusbandNameEn: 'Guntupalli Srinivasa Rao',
    fatherOrHusbandNameTe: 'గుంటుపల్లి శ్రీనివాసరావు',
    cultivatorNameEn: 'Guntupalli Lakshmi Devi',
    cultivatorNameTe: 'గుంటుపల్లి లక్ష్మీదేవి',
    totalExtentAcres: 3.10,
    cultivableExtentAcres: 3.10,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Borewell (బోరు బావి)',
    cropDetails: 'Cotton / Chilli (పత్తి / మిరప)',
    aadhaarSeeded: true,
    aadhaarLast4: '6190',
    passbookNumber: 'AP/PPB/2023/070104-315',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '47', south: '49', east: '48/4', west: '48/2' }
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '0701',
    mandalNameEn: 'Mangalagiri',
    mandalNameTe: 'మంగళగిరి',
    villageCode: '070101',
    villageNameEn: 'Mangalagiri',
    villageNameTe: 'మంగళగిరి',
    surveyNo: '210',
    subDivisionNo: '1A',
    lpNo: 'LP/07/0701/210-1A',
    khataNo: '540',
    pattadarNameEn: 'Marella Venkateswarlu',
    pattadarNameTe: 'మారెళ్ల వెంకటేశ్వర్లు',
    fatherOrHusbandNameEn: 'Marella Krishnaiah',
    fatherOrHusbandNameTe: 'మారెళ్ల కృష్ణయ్య',
    cultivatorNameEn: 'Marella Venkateswarlu',
    cultivatorNameTe: 'మారెళ్ల వెంకటేశ్వర్లు',
    totalExtentAcres: 4.50,
    cultivableExtentAcres: 4.50,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Borewell (బోరు బావి)',
    cropDetails: 'Turmeric / Maize (పసుపు / మొక్కజొన్న)',
    aadhaarSeeded: true,
    aadhaarLast4: '9923',
    passbookNumber: 'AP/PPB/2022/070101-540',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '209', south: '211', east: '210/2', west: '208' }
  },
  {
    districtCode: '06',
    districtNameEn: 'Krishna',
    districtNameTe: 'కృష్ణా',
    mandalCode: '0601',
    mandalNameEn: 'Vijayawada Rural',
    mandalNameTe: 'విజయవాడ రూరల్',
    villageCode: '060102',
    villageNameEn: 'Gollapudi',
    villageNameTe: 'గొల్లపూడి',
    surveyNo: '75',
    subDivisionNo: '2',
    lpNo: 'LP/06/0601/75-2',
    khataNo: '188',
    pattadarNameEn: 'Nalamati Nageswara Rao',
    pattadarNameTe: 'నలమటి నాగేశ్వరరావు',
    fatherOrHusbandNameEn: 'Nalamati Satyanarayana',
    fatherOrHusbandNameTe: 'నలమటి సత్యనారాయణ',
    cultivatorNameEn: 'Nalamati Nageswara Rao',
    cultivatorNameTe: 'నలమటి నాగేశ్వరరావు',
    totalExtentAcres: 1.25,
    cultivableExtentAcres: 1.25,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Wet (మాగాణి)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Canal (కాలువ)',
    cropDetails: 'Paddy (వరి)',
    aadhaarSeeded: true,
    aadhaarLast4: '1044',
    passbookNumber: 'AP/PPB/2021/060102-188',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '74', south: '76', east: '75/3', west: '75/1' }
  }
];

const seedApplications = [
  {
    applicationNo: 'MUT2026AP009412',
    applicantName: 'Kollipara Venkata Subbarao',
    serviceType: 'Mutation for Transactions',
    districtName: 'Guntur',
    mandalName: 'Mangalagiri',
    villageName: 'Chinakakani',
    surveyNo: '125/1',
    khataNo: '102',
    currentStatus: 'Approved',
    assignedOfficer: 'Tahsildar, Mangalagiri Mandal',
    remarks: 'Mutation sanctioned successfully. Title deed updated in MeeBhoomi ROR 1-B.'
  },
  {
    applicationNo: 'MUT2026AP018241',
    applicantName: 'Boddu Sambasiva Rao',
    serviceType: 'Mutation for Correction',
    districtName: 'Guntur',
    mandalName: 'Mangalagiri',
    villageName: 'Chinakakani',
    surveyNo: '125/2',
    khataNo: '204',
    currentStatus: 'VRO Verification Completed',
    assignedOfficer: 'Revenue Inspector (RI), Mangalagiri',
    remarks: 'Field inspection completed. File forwarded to Deputy Tahsildar.'
  },
  {
    applicationNo: 'LCN2026AP004128',
    applicantName: 'Guntupalli Lakshmi Devi',
    serviceType: 'Land Conversion For Non Agriculture Purpose',
    districtName: 'Guntur',
    mandalName: 'Mangalagiri',
    villageName: 'Chinakakani',
    surveyNo: '48/3',
    khataNo: '315',
    currentStatus: 'Tahsildar Approval In Progress',
    assignedOfficer: 'Revenue Divisional Officer (RDO), Guntur',
    remarks: 'NALA conversion fee paid. Final inspection report under review.'
  }
];

// In-Memory Seed Storage for fallback
const inMemoryData = {
  districts: seedDistricts,
  mandals: seedMandals,
  villages: seedVillages,
  records: seedRecords,
  applications: seedApplications
};

const upsertMissing = async (Model, documents, keyFields) => {
  if (documents.length === 0) return;

  await Model.bulkWrite(documents.map((document) => ({
    updateOne: {
      filter: Object.fromEntries(keyFields.map((field) => [field, document[field]])),
      update: { $setOnInsert: document },
      upsert: true
    }
  })), { ordered: true });
};

const runSeed = async () => {
  try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
    const { connectDB } = require('../config/db');
    const connected = await connectDB();
    if (!connected) {
      throw new Error('Seeding requires a live MongoDB connection.');
    }

    await upsertMissing(District, seedDistricts, ['code']);
    await upsertMissing(Mandal, seedMandals, ['districtCode', 'code']);
    await upsertMissing(Village, seedVillages, ['mandalCode', 'code']);
    await upsertMissing(LandRecord, seedRecords, [
      'districtCode',
      'mandalCode',
      'villageCode',
      'surveyNo',
      'subDivisionNo'
    ]);
    await upsertMissing(ApplicationStatus, seedApplications, ['applicationNo']);

    console.log('[Seed] Demo records added where missing. Existing database records were preserved.');
  } catch (error) {
    console.error(`[Seed] Failed (${error.name}). Check MongoDB connectivity and seed data validation.`);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = {
  seedDistricts,
  seedMandals,
  seedVillages,
  seedRecords,
  seedApplications,
  upsertMissing,
  inMemoryData
};
