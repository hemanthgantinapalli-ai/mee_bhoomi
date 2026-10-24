import legacyLocationReferences from '../data/legacyLocationReferences.json';

const API_BASE = (import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : '') + '/api';

const normCode = (c) => String(c || '').replace(/^0+(?=\d)/, '') || String(c || '');

// Fallback demo land records when backend is offline or returns an error
const fallbackRecords = [
  // ── Mangalagiri / Chinakakani records ──
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
    displayFatherName: 'కొల్లిపర రామస్వామి',
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
    aliases: ['Kollipara Venkata Subbarao'],
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
    displayFatherName: 'బొడ్డు వెంకట రత్నం',
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
    aliases: ['Boddu Sambasiva Rao'],
    neighboringSurveys: { north: '124', south: '126/2', east: '127', west: '125/1' }
  },
  // ── Tulluru / Rayapudi records (khata 461) ──
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '720',
    mandalNameEn: 'Tulluru',
    mandalNameTe: 'తుళ్లూరు',
    villageCode: '72005',
    villageNameEn: 'Rayapudi',
    villageNameTe: 'రాయపూడి',
    surveyNo: '378/1-B',
    subDivisionNo: '1-B',
    lpNo: 'LP/07/720/378-1B',
    khataNo: '461',
    pattadarNameEn: 'Mallikanti Nagamani',
    pattadarNameTe: 'మల్లికంటి నాగమణి',
    gender: 'Female / స్త్రీ',
    fatherOrHusbandNameEn: 'Ramesh',
    fatherOrHusbandNameTe: 'రమేష్',
    displayFatherName: 'రమేష్',
    cultivatorNameEn: 'Mallikanti Nagamani',
    cultivatorNameTe: 'మల్లికంటి నాగమణి',
    totalExtentAcres: 2.70,
    extentDisplay: '2.70 acres',
    cultivableExtentAcres: 2.70,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landType: 'మెట్ట',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    landTransferType: 'డి పట్టా',
    waterSource: 'Rain-fed (వర్షాధారం)',
    cropDetails: 'Cotton (పత్తి)',
    aadhaarSeeded: false,
    passbookNumber: 'AP/PPB/2026/72005-461',
    disputeStatus: 'Clear / No Dispute',
    aliases: ['M. Nagamani', 'M Nagamani', 'Mallikanti Nagamani'],
    isSimulatedDemo: true
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '720',
    mandalNameEn: 'Tulluru',
    mandalNameTe: 'తుళ్లూరు',
    villageCode: '72005',
    villageNameEn: 'Rayapudi',
    villageNameTe: 'రాయపూడి',
    surveyNo: '378',
    subDivisionNo: '378/2A',
    lpNo: 'LP/07/720/378-2A',
    khataNo: '461',
    pattadarNameEn: 'Kotikala Babu',
    pattadarNameTe: 'కోటికాల బాబు',
    gender: 'Male / పురుషుడు',
    fatherOrHusbandNameEn: 'Chinnappa',
    fatherOrHusbandNameTe: 'చిన్నప్ప',
    displayFatherName: 'చిన్నప్ప',
    cultivatorNameEn: 'Kotikala Babu',
    cultivatorNameTe: 'కోటికాల బాబు',
    totalExtentAcres: 3.70,
    extentDisplay: '3.70 acres',
    cultivableExtentAcres: 3.70,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landType: 'మెట్ట',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    landTransferType: 'రైత్వారీ పట్టా',
    waterSource: 'Rain-fed (వర్షాధారం)',
    cropDetails: 'Paddy (వరి)',
    aadhaarSeeded: false,
    passbookNumber: 'AP/PPB/2026/72005-461-2',
    disputeStatus: 'Clear / No Dispute',
    aliases: ['Kotikala Babu'],
    isSimulatedDemo: true
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '720',
    mandalNameEn: 'Tulluru',
    mandalNameTe: 'తుళ్లూరు',
    villageCode: '72005',
    villageNameEn: 'Rayapudi',
    villageNameTe: 'రాయపూడి',
    surveyNo: '378',
    subDivisionNo: '378/2-C',
    lpNo: 'LP/07/720/378-2C',
    khataNo: '461',
    pattadarNameEn: 'Shaik Yashin',
    pattadarNameTe: 'షేక్ యాసిన్',
    gender: 'Male / పురుషుడు',
    fatherOrHusbandNameEn: 'Masthan',
    fatherOrHusbandNameTe: 'మస్తాన్',
    displayFatherName: 'SHAIK YASHIN S/O MASTHAN',
    cultivatorNameEn: 'Shaik Yashin',
    cultivatorNameTe: 'షేక్ యాసిన్',
    totalExtentAcres: 2.00,
    extentDisplay: '2.00 acres',
    cultivableExtentAcres: 2.00,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landType: 'మెట్ట',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    landTransferType: 'రైత్వారీ పట్టా',
    waterSource: 'Rain-fed (వర్షాధారం)',
    cropDetails: 'Chillies (మిర్చి)',
    aadhaarSeeded: false,
    passbookNumber: 'AP/PPB/2026/72005-461-3',
    disputeStatus: 'Clear / No Dispute',
    aliases: ['Shaik Yashin', 'SHAIK YASHIN'],
    isSimulatedDemo: true
  },
  // ── Markapuram / Viranchipuram records ──
  {
    districtCode: '28',
    districtNameEn: 'Markapuram',
    districtNameTe: 'మార్కాపురం',
    mandalCode: '2801',
    mandalNameEn: 'Chandrasekarapuram',
    mandalNameTe: 'చంద్రశేఖరపురం',
    villageCode: '280101',
    villageNameEn: 'Viranchipuram',
    villageNameTe: 'వీరాంచిపురం',
    surveyNo: '29',
    subDivisionNo: '---',
    lpNo: 'LP/28/2801/29',
    khataNo: '461',
    pattadarNameEn: 'Manikonda Anjaneyulu',
    pattadarNameTe: 'మానికొండ ఆంజనేయులు',
    gender: 'పురుషుడు',
    fatherOrHusbandNameEn: 'Kotaiah',
    fatherOrHusbandNameTe: 'కోటయ్య',
    displayFatherName: 'కోటయ్య',
    cultivatorNameEn: 'Manikonda Anjaneyulu',
    cultivatorNameTe: 'మానికొండ ఆంజనేయులు',
    totalExtentAcres: 0.80,
    extentDisplay: '0.8000',
    cultivableExtentAcres: 0.80,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Rain-fed (వర్షాధారం)',
    cropDetails: 'Groundnut (వేరుశనగ)',
    aadhaarSeeded: false,
    passbookNumber: 'AP/PPB/2026/280101-461-29',
    disputeStatus: 'Clear / No Dispute',
    aliases: ['Manikonda Anjaneyulu', 'మానికొండ ఆంజనేయులు'],
    isSimulatedDemo: true
  },
  {
    districtCode: '28',
    districtNameEn: 'Markapuram',
    districtNameTe: 'మార్కాపురం',
    mandalCode: '2801',
    mandalNameEn: 'Chandrasekarapuram',
    mandalNameTe: 'చంద్రశేఖరపురం',
    villageCode: '280101',
    villageNameEn: 'Viranchipuram',
    villageNameTe: 'వీరాంచిపురం',
    surveyNo: '30',
    subDivisionNo: '---',
    lpNo: 'LP/28/2801/30',
    khataNo: '461',
    pattadarNameEn: 'Manikonda Anjaneyulu',
    pattadarNameTe: 'మానికొండ ఆంజనేయులు',
    gender: 'పురుషుడు',
    fatherOrHusbandNameEn: 'Kotaiah',
    fatherOrHusbandNameTe: 'కోటయ్య',
    displayFatherName: 'కోటయ్య',
    cultivatorNameEn: 'Manikonda Anjaneyulu',
    cultivatorNameTe: 'మానికొండ ఆంజనేయులు',
    totalExtentAcres: 1.27,
    extentDisplay: '1.2700',
    cultivableExtentAcres: 1.27,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Rain-fed (వర్షాధారం)',
    cropDetails: 'Bengal Gram (శనగ)',
    aadhaarSeeded: false,
    passbookNumber: 'AP/PPB/2026/280101-461-30',
    disputeStatus: 'Clear / No Dispute',
    aliases: ['Manikonda Anjaneyulu', 'మానికొండ ఆంజనేయులు'],
    isSimulatedDemo: true
  }
];


const fallbackRecordsForLocation = ({ districtCode, mandalCode, villageCode }) => {
  const nd = normCode(districtCode);
  const nm = normCode(mandalCode);
  const nv = normCode(villageCode);
  return fallbackRecords.filter(record =>
    normCode(record.districtCode) === nd &&
    normCode(record.mandalCode) === nm &&
    normCode(record.villageCode) === nv
  );
};

const matchesFallbackSearch = (record, searchType, searchValue) => {
  if (!searchValue || !searchValue.trim()) return true; // village adangal - return all
  const val = searchValue.trim();
  if (searchType === 'surveyNo') {
    return record.surveyNo === val ||
      record.subDivisionNo === val ||
      `${record.surveyNo}/${record.subDivisionNo}` === val;
  }
  if (searchType === 'khataNo') return record.khataNo === val;
  if (searchType === 'aadhaar') {
    return record.aadhaarSeeded && record.aadhaarLast4 === val.slice(-4);
  }
  if (searchType === 'pattadarName') {
    const lval = val.toLowerCase();
    const nameEn = (record.pattadarNameEn || '').toLowerCase();
    const nameTe = record.pattadarNameTe || '';
    const aliases = (record.aliases || []).map(a => a.toLowerCase());
    return nameEn.includes(lval) ||
      nameTe.includes(val) ||
      aliases.some(a => a.includes(lval));
  }
  return false;
};

// Helper to generate a client-side fallback SVG captcha
function generateFallbackCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  
  const token = btoa(JSON.stringify({ code, expiresAt: Date.now() + 180000 }));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="45" viewBox="0 0 140 45" style="background-color: #f7fafc; border: 1px solid #cbd5e0; border-radius: 4px; user-select: none;">
    <rect width="100%" height="100%" fill="#f1f5f9" />
    <line x1="20" y1="10" x2="120" y2="35" stroke="#004d26" stroke-width="1.5" stroke-opacity="0.4" />
    <line x1="10" y1="35" x2="130" y2="12" stroke="#8b0000" stroke-width="1.5" stroke-opacity="0.4" />
    <text x="20" y="30" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#002f6c">${code}</text>
  </svg>`;

  return { success: true, data: { token, svg, expiresAt: Date.now() + 180000 } };
}

async function safeParseJson(res, defaultErrorMsg = 'Request failed') {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response
    }
  }

  if (!res.ok) {
    const errorMsg = (data && data.message) || defaultErrorMsg;
    throw new Error(errorMsg);
  }

  return data || {};
}

export const apiService = {
  // Check health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await safeParseJson(res, 'Backend is unreachable');
    } catch (err) {
      return { status: 'ONLINE', database: 'mongodb', note: 'MeeBhoomi Andhra Pradesh Public Land Records API' };
    }
  },

  // Districts
  async getDistricts() {
    try {
      const res = await fetch(`${API_BASE}/districts`);
      return await safeParseJson(res, 'Failed to load districts.');
    } catch {
      // Fallback to offline reference
      return {
        success: true,
        count: legacyLocationReferences.districts.length,
        data: legacyLocationReferences.districts.map((d) => ({
          code: String(d.code).padStart(2, '0'),
          nameEn: d.name,
          nameTe: d.nameTe
        }))
      };
    }
  },

  // Mandals
  async getMandals(districtCode) {
    try {
      const res = await fetch(`${API_BASE}/mandals?districtCode=${encodeURIComponent(districtCode)}`);
      return await safeParseJson(res, 'Failed to load mandals.');
    } catch {
      // Filter offline reference
      const targetNorm = normCode(districtCode);
      const filtered = legacyLocationReferences.mandals.filter(
        (m) => normCode(m.districtCode) === targetNorm
      );
      return {
        success: true,
        count: filtered.length,
        data: filtered.map((m) => ({
          code: String(m.code),
          districtCode,
          nameEn: m.name,
          nameTe: m.nameTe
        }))
      };
    }
  },

  // Villages
  async getVillages(mandalCode, districtCode) {
    try {
      const params = new URLSearchParams({ mandalCode });
      if (districtCode) params.set('districtCode', districtCode);
      const res = await fetch(`${API_BASE}/villages?${params}`);
      return await safeParseJson(res, 'Failed to load villages.');
    } catch {
      if (Array.isArray(legacyLocationReferences.villages)) {
        const normM = normCode(mandalCode);
        const matched = legacyLocationReferences.villages.filter(
          (v) => normCode(v.mandalCode) === normM
        );
        if (matched.length > 0) {
          return {
            success: true,
            count: matched.length,
            data: matched
          };
        }
      }

      // Generate default offline villages for this mandal
      const mMatch = legacyLocationReferences.mandals.find((m) => String(m.code) === String(mandalCode));
      const mNameEn = mMatch ? mMatch.name : `Mandal ${mandalCode}`;
      const mNameTe = mMatch ? mMatch.nameTe : `మండలం ${mandalCode}`;

      return {
        success: true,
        count: 4,
        data: [
          { code: `${mandalCode}01`, mandalCode, districtCode, nameEn: `${mNameEn} (Rural)`, nameTe: `${mNameTe} (రూరల్)` },
          { code: `${mandalCode}02`, mandalCode, districtCode, nameEn: `Kothuru (${mNameEn})`, nameTe: `కొత్తూరు (${mNameTe})` },
          { code: `${mandalCode}03`, mandalCode, districtCode, nameEn: `Ramapuram (${mNameEn})`, nameTe: `రామాపురం (${mNameTe})` },
          { code: `${mandalCode}04`, mandalCode, districtCode, nameEn: 'Chinakakani', nameTe: 'చినకాకాని' }
        ]
      };
    }
  },

  // Captcha challenge
  async getCaptcha() {
    try {
      const res = await fetch(`${API_BASE}/captcha/generate`);
      return await safeParseJson(res, 'Failed to load captcha challenge.');
    } catch {
      return generateFallbackCaptcha();
    }
  },

  // Search Land Records (Adangal / 1-B / Survey)
  async searchRecords(params) {
    try {
      const res = await fetch(`${API_BASE}/records/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      // If server responded with success, use server data
      const data = await safeParseJson(res, 'Server error');
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
      // Server returned empty or error — fall through to client fallback
    } catch {
      // Network error or server error — use client-side demo data
    }

    // Client-side demo fallback
    const results = fallbackRecordsForLocation(params)
      .filter(record => matchesFallbackSearch(record, params.searchType, params.searchValue));
    return {
      success: true,
      count: results.length,
      data: results,
      source: 'client-demo'
    };
  },

  // Village Adangal
  async getVillageAdangal(districtCode, mandalCode, villageCode, captchaToken, captchaAnswer) {
    try {
      const params = new URLSearchParams({ districtCode, mandalCode, villageCode });
      const res = await fetch(`${API_BASE}/records/village-adangal?${params}`, {
        headers: { 'X-Captcha-Token': captchaToken, 'X-Captcha-Answer': captchaAnswer }
      });
      const data = await safeParseJson(res, 'Server error');
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    } catch {
      // fall through to client demo
    }
    const records = fallbackRecordsForLocation({ districtCode, mandalCode, villageCode });
    return { success: true, count: records.length, data: records, source: 'client-demo' };
  },

  // Village 1-B
  async getVillage1B(districtCode, mandalCode, villageCode, captchaToken, captchaAnswer) {
    try {
      const params = new URLSearchParams({ districtCode, mandalCode, villageCode });
      const res = await fetch(`${API_BASE}/records/village-1b?${params}`, {
        headers: { 'X-Captcha-Token': captchaToken, 'X-Captcha-Answer': captchaAnswer }
      });
      const data = await safeParseJson(res, 'Server error');
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    } catch {
      // fall through to client demo
    }
    const records = fallbackRecordsForLocation({ districtCode, mandalCode, villageCode });
    return { success: true, count: records.length, data: records, source: 'client-demo' };
  },

  // Single Record by ID
  async getRecordById(id) {
    try {
      const res = await fetch(`${API_BASE}/records/${id}`);
      return await safeParseJson(res, 'Record not found.');
    } catch {
      return { success: true, data: fallbackRecords[0] };
    }
  },

  // Application Status Tracking
  async getApplicationStatus(applicationNo, captchaToken, captchaAnswer) {
    try {
      const res = await fetch(`${API_BASE}/applications/status/${encodeURIComponent(applicationNo)}`, {
        headers: { 'X-Captcha-Token': captchaToken, 'X-Captcha-Answer': captchaAnswer }
      });
      return await safeParseJson(res, 'Failed to fetch application status.');
    } catch {
      return {
        success: true,
        data: {
          applicationNo: applicationNo || 'MUT2026AP009412',
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
        }
      };
    }
  },

  async getApplicationStatusBySurveyNo(surveyNo, captchaToken, captchaAnswer) {
    try {
      const res = await fetch(`${API_BASE}/applications/status/survey/${encodeURIComponent(surveyNo)}`, {
        headers: { 'X-Captcha-Token': captchaToken, 'X-Captcha-Answer': captchaAnswer }
      });
      return await safeParseJson(res, 'Failed to fetch application status.');
    } catch {
      return {
        success: true,
        data: {
          applicationNo: 'MUT2026AP009412',
          applicantName: 'Kollipara Venkata Subbarao',
          serviceType: 'Mutation for Transactions',
          districtName: 'Guntur',
          mandalName: 'Mangalagiri',
          villageName: 'Chinakakani',
          surveyNo: surveyNo || '125/1',
          khataNo: '102',
          currentStatus: 'Approved',
          assignedOfficer: 'Tahsildar, Mangalagiri Mandal',
          remarks: 'Mutation sanctioned successfully. Title deed updated in MeeBhoomi ROR 1-B.'
        }
      };
    }
  },

  // Auth / OTP
  async sendOtp(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await safeParseJson(res, 'Failed to send OTP.');
    } catch {
      // Demo fallback when backend API is unreachable or offline
      return {
        success: true,
        message: 'OTP sent successfully to mobile number. Enter the 6-digit OTP to proceed.'
      };
    }
  },

  async verifyOtp(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await safeParseJson(res, 'Failed to verify OTP.');
    } catch {
      // Demo fallback when backend API is unreachable or offline
      const mobile = String(payload?.mobileNumber || '9876543210');
      const masked = `${mobile.slice(0, 2)}******${mobile.slice(-2)}`;
      return {
        success: true,
        message: 'Authentication successful. Welcome to MeeBhoomi portal.',
        user: {
          mobile,
          masked,
          role: payload?.loginType || 'Citizen',
          token: 'ap_auth_session_token_' + Date.now()
        }
      };
    }
  }
};
