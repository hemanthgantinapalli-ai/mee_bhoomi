const District = require('../models/District');
const Mandal = require('../models/Mandal');
const Village = require('../models/Village');
const LandRecord = require('../models/LandRecord');
const ApplicationStatus = require('../models/ApplicationStatus');
const mongoose = require('mongoose');

let adminDataset = null;
try {
  adminDataset = require('./administrativeData.json');
} catch (e) {
  adminDataset = null;
}

const fallbackDistricts = [
  { code: '07', nameEn: 'Guntur', nameTe: 'గుంటూరు', headquarters: 'Guntur' },
  { code: '06', nameEn: 'Krishna', nameTe: 'కృష్ణా', headquarters: 'Machilipatnam' },
  { code: '03', nameEn: 'Visakhapatnam', nameTe: 'విశాఖపట్నం', headquarters: 'Visakhapatnam' },
  { code: '10', nameEn: 'Chittoor', nameTe: 'చిత్తూరు', headquarters: 'Chittoor' },
  { code: '04', nameEn: 'East Godavari', nameTe: 'తూర్పు గోదావరి', headquarters: 'Rajamahendravaram' },
  { code: '13', nameEn: 'Kurnool', nameTe: 'కర్నూలు', headquarters: 'Kurnool' },
  { code: '11', nameEn: 'YSR Kadapa', nameTe: 'వైఎస్ఆర్ కడప', headquarters: 'Kadapa' },
  { code: '09', nameEn: 'Nellore', nameTe: 'నెల్లూరు', headquarters: 'Nellore' }
];

const fallbackMandals = [
  // Guntur (07)
  { code: '0701', districtCode: '07', nameEn: 'Mangalagiri', nameTe: 'మంగళగిరి' },
  { code: '0702', districtCode: '07', nameEn: 'Tenali', nameTe: 'తెనాలి' },
  { code: '0703', districtCode: '07', nameEn: 'Tadikonda', nameTe: 'తాడికొండ' },
  { code: '0704', districtCode: '07', nameEn: 'Amaravati', nameTe: 'అమరావతి' },
  { code: '0705', districtCode: '07', nameEn: 'Guntur Urban', nameTe: 'గుంటూరు అర్బన్' },
  // Krishna (06)
  { code: '0601', districtCode: '06', nameEn: 'Vijayawada Rural', nameTe: 'విజయవాడ రూరల్' },
  { code: '0602', districtCode: '06', nameEn: 'Gannavaram', nameTe: 'గన్నవరం' },
  { code: '0603', districtCode: '06', nameEn: 'Gudivada', nameTe: 'గుడివాడ' },
  // Visakhapatnam (03)
  { code: '0301', districtCode: '03', nameEn: 'Anandapuram', nameTe: 'ఆనందపురం' },
  { code: '0302', districtCode: '03', nameEn: 'Bheemunipatnam', nameTe: 'భీమునిపట్నం' },
  { code: '0303', districtCode: '03', nameEn: 'Pendurthi', nameTe: 'పెందుర్తి' },
  // Chittoor (10)
  { code: '1001', districtCode: '10', nameEn: 'Tirupati Urban', nameTe: 'తిరుపతి అర్బన్' },
  { code: '1002', districtCode: '10', nameEn: 'Chandragiri', nameTe: 'చంద్రగిరి' },
  // East Godavari (04)
  { code: '0401', districtCode: '04', nameEn: 'Rajamahendravaram Urban', nameTe: 'రాజమహేంద్రవరం అర్బన్' },
  { code: '0402', districtCode: '04', nameEn: 'Kadiam', nameTe: 'కడియం' },
  // Kurnool (13)
  { code: '1301', districtCode: '13', nameEn: 'Kurnool Urban', nameTe: 'కర్నూలు అర్బన్' },
  { code: '1302', districtCode: '13', nameEn: 'Nandyal', nameTe: 'నంద్యాల' },
  // YSR Kadapa (11)
  { code: '1101', districtCode: '11', nameEn: 'Kadapa Urban', nameTe: 'కడప అర్బన్' },
  { code: '1102', districtCode: '11', nameEn: 'Proddatur', nameTe: 'ప్రొద్దుటూరు' },
  // Nellore (09)
  { code: '0901', districtCode: '09', nameEn: 'Nellore Urban', nameTe: 'నెల్లూరు అర్బన్' },
  { code: '0902', districtCode: '09', nameEn: 'Kovur', nameTe: 'కోవూరు' }
];

const fallbackVillages = [
  // --- GUNTUR (07) ---
  // Mangalagiri (0701)
  { code: '070101', mandalCode: '0701', districtCode: '07', nameEn: 'Mangalagiri', nameTe: 'మంగళగిరి', censusCode: '587601' },
  { code: '070102', mandalCode: '0701', districtCode: '07', nameEn: 'Atmakuru', nameTe: 'ఆత్మకూరు', censusCode: '587602' },
  { code: '070103', mandalCode: '0701', districtCode: '07', nameEn: 'Nutakki', nameTe: 'నూతక్కి', censusCode: '587603' },
  { code: '070104', mandalCode: '0701', districtCode: '07', nameEn: 'Chinakakani', nameTe: 'చినకాకాని', censusCode: '587604' },
  { code: '070105', mandalCode: '0701', districtCode: '07', nameEn: 'Nowluru', nameTe: 'నవులూరు', censusCode: '587605' },
  { code: '070106', mandalCode: '0701', districtCode: '07', nameEn: 'Nidamarru', nameTe: 'నిడమర్రు', censusCode: '587606' },
  { code: '070107', mandalCode: '0701', districtCode: '07', nameEn: 'Kuragallu', nameTe: 'కురగల్లు', censusCode: '587607' },

  // Tenali (0702)
  { code: '070201', mandalCode: '0702', districtCode: '07', nameEn: 'Pinapadu', nameTe: 'పినపాడు', censusCode: '587610' },
  { code: '070202', mandalCode: '0702', districtCode: '07', nameEn: 'Kolakaluru', nameTe: 'కొలకలూరు', censusCode: '587611' },
  { code: '070203', mandalCode: '0702', districtCode: '07', nameEn: 'Angalakuduru', nameTe: 'అంగలకుదురు', censusCode: '587612' },
  { code: '070204', mandalCode: '0702', districtCode: '07', nameEn: 'Burripalem', nameTe: 'బుర్రిపాలెం', censusCode: '587613' },
  { code: '070205', mandalCode: '0702', districtCode: '07', nameEn: 'Nandivelugu', nameTe: 'నందివెలుగు', censusCode: '587614' },

  // Tadikonda (0703)
  { code: '070301', mandalCode: '0703', districtCode: '07', nameEn: 'Tadikonda', nameTe: 'తాడికొండ', censusCode: '587620' },
  { code: '070302', mandalCode: '0703', districtCode: '07', nameEn: 'Kantheru', nameTe: 'కాంతేరు', censusCode: '587621' },
  { code: '070303', mandalCode: '0703', districtCode: '07', nameEn: 'Ponnekallu', nameTe: 'పొన్నెకల్లు', censusCode: '587622' },
  { code: '070304', mandalCode: '0703', districtCode: '07', nameEn: 'Lam', nameTe: 'లాం', censusCode: '587623' },
  { code: '070305', mandalCode: '0703', districtCode: '07', nameEn: 'Mothadaka', nameTe: 'మోతడక', censusCode: '587624' },

  // Amaravati (0704)
  { code: '070401', mandalCode: '0704', districtCode: '07', nameEn: 'Amaravati', nameTe: 'అమరావతి', censusCode: '587630' },
  { code: '070402', mandalCode: '0704', districtCode: '07', nameEn: 'Dharanikota', nameTe: 'ధరణికోట', censusCode: '587631' },
  { code: '070403', mandalCode: '0704', districtCode: '07', nameEn: 'Narukullapadu', nameTe: 'నరుకుళ్ళపాడు', censusCode: '587632' },
  { code: '070404', mandalCode: '0704', districtCode: '07', nameEn: 'Karlapudi', nameTe: 'కార్లపూడి', censusCode: '587633' },

  // Guntur Urban (0705)
  { code: '070501', mandalCode: '0705', districtCode: '07', nameEn: 'Guntur East', nameTe: 'గుంటూరు తూర్పు', censusCode: '587640' },
  { code: '070502', mandalCode: '0705', districtCode: '07', nameEn: 'Guntur West', nameTe: 'గుంటూరు పశ్చిమ', censusCode: '587641' },
  { code: '070503', mandalCode: '0705', districtCode: '07', nameEn: 'Nallapadu', nameTe: 'నల్లపాడు', censusCode: '587642' },
  { code: '070504', mandalCode: '0705', districtCode: '07', nameEn: 'Peda Palakaluru', nameTe: 'పెద పలకలూరు', censusCode: '587643' },

  // --- KRISHNA (06) ---
  // Vijayawada Rural (0601)
  { code: '060101', mandalCode: '0601', districtCode: '06', nameEn: 'Nunna', nameTe: 'నున్నా', censusCode: '586501' },
  { code: '060102', mandalCode: '0601', districtCode: '06', nameEn: 'Gollapudi', nameTe: 'గొల్లపూడి', censusCode: '586502' },
  { code: '060103', mandalCode: '0601', districtCode: '06', nameEn: 'Enikepadu', nameTe: 'ఏనికేపాడు', censusCode: '586503' },
  { code: '060104', mandalCode: '0601', districtCode: '06', nameEn: 'Ramavarappadu', nameTe: 'రామవరప్పాడు', censusCode: '586504' },
  { code: '060105', mandalCode: '0601', districtCode: '06', nameEn: 'Prasadampadu', nameTe: 'ప్రసాదంపాడు', censusCode: '586505' },

  // Gannavaram (0602)
  { code: '060201', mandalCode: '0602', districtCode: '06', nameEn: 'Gannavaram', nameTe: 'గన్నవరం', censusCode: '586510' },
  { code: '060202', mandalCode: '0602', districtCode: '06', nameEn: 'Allapuram', nameTe: 'అల్లాపురం', censusCode: '586511' },
  { code: '060203', mandalCode: '0602', districtCode: '06', nameEn: 'Kesarapalli', nameTe: 'కేసరపల్లి', censusCode: '586512' },
  { code: '060204', mandalCode: '0602', districtCode: '06', nameEn: 'Savaragudem', nameTe: 'సవరగూడెం', censusCode: '586513' },

  // Gudivada (0603)
  { code: '060301', mandalCode: '0603', districtCode: '06', nameEn: 'Gudivada', nameTe: 'గుడివాడ', censusCode: '586520' },
  { code: '060302', mandalCode: '0603', districtCode: '06', nameEn: 'Billapadu', nameTe: 'బిళ్ళపాడు', censusCode: '586521' },
  { code: '060303', mandalCode: '0603', districtCode: '06', nameEn: 'Mallayapalem', nameTe: 'మల్లాయపాలెం', censusCode: '586522' },
  { code: '060304', mandalCode: '0603', districtCode: '06', nameEn: 'Valivartipadu', nameTe: 'వలివర్తిపాడు', censusCode: '586523' },

  // --- VISAKHAPATNAM (03) ---
  // Anandapuram (0301)
  { code: '030101', mandalCode: '0301', districtCode: '03', nameEn: 'Anandapuram', nameTe: 'ఆనందపురం', censusCode: '583101' },
  { code: '030102', mandalCode: '0301', districtCode: '03', nameEn: 'Gambheeram', nameTe: 'గంభీరం', censusCode: '583102' },
  { code: '030103', mandalCode: '0301', districtCode: '03', nameEn: 'Vellanki', nameTe: 'వెల్లంకి', censusCode: '583103' },
  { code: '030104', mandalCode: '0301', districtCode: '03', nameEn: 'Boni', nameTe: 'బోని', censusCode: '583104' },

  // Bheemunipatnam (0302)
  { code: '030201', mandalCode: '0302', districtCode: '03', nameEn: 'Bheemunipatnam', nameTe: 'భీమునిపట్నం', censusCode: '583110' },
  { code: '030202', mandalCode: '0302', districtCode: '03', nameEn: 'Tagarapuvalasa', nameTe: 'తగరపువలస', censusCode: '583111' },
  { code: '030203', mandalCode: '0302', districtCode: '03', nameEn: 'Nerellavalasa', nameTe: 'నేరెళ్ళవలస', censusCode: '583112' },
  { code: '030204', mandalCode: '0302', districtCode: '03', nameEn: 'Kapuluppada', nameTe: 'కాపులుప్పాడ', censusCode: '583113' },

  // Pendurthi (0303)
  { code: '030301', mandalCode: '0303', districtCode: '03', nameEn: 'Pendurthi', nameTe: 'పెందుర్తి', censusCode: '583120' },
  { code: '030302', mandalCode: '0303', districtCode: '03', nameEn: 'Chinnamushidiwada', nameTe: 'చిన్నముషిడివాడ', censusCode: '583121' },
  { code: '030303', mandalCode: '0303', districtCode: '03', nameEn: 'Sujatanagar', nameTe: 'సుజాతనగర్', censusCode: '583122' },

  // --- CHITTOOR (10) ---
  // Tirupati Urban (1001)
  { code: '100101', mandalCode: '1001', districtCode: '10', nameEn: 'Tirupati', nameTe: 'తిరుపతి', censusCode: '595101' },
  { code: '100102', mandalCode: '1001', districtCode: '10', nameEn: 'Avilala', nameTe: 'అవిలాల', censusCode: '595102' },
  { code: '100103', mandalCode: '1001', districtCode: '10', nameEn: 'Settipalli', nameTe: 'శెట్టిపల్లి', censusCode: '595103' },
  { code: '100104', mandalCode: '1001', districtCode: '10', nameEn: 'Peruru', nameTe: 'పేరూరు', censusCode: '595104' },

  // Chandragiri (1002)
  { code: '100201', mandalCode: '1002', districtCode: '10', nameEn: 'Chandragiri', nameTe: 'చంద్రగిరి', censusCode: '595110' },
  { code: '100202', mandalCode: '1002', districtCode: '10', nameEn: 'A.Rangampeta', nameTe: 'ఎ.రంగంపేట', censusCode: '595111' },
  { code: '100203', mandalCode: '1002', districtCode: '10', nameEn: 'Kotala', nameTe: 'కోటాల', censusCode: '595112' },
  { code: '100204', mandalCode: '1002', districtCode: '10', nameEn: 'Sanambatla', nameTe: 'సానంబట్ల', censusCode: '595113' },

  // --- EAST GODAVARI (04) ---
  // Rajamahendravaram Urban (0401)
  { code: '040101', mandalCode: '0401', districtCode: '04', nameEn: 'Rajahmundry', nameTe: 'రాజమండ్రి', censusCode: '584101' },
  { code: '040102', mandalCode: '0401', districtCode: '04', nameEn: 'Hukumpeta', nameTe: 'హుకుంపేట', censusCode: '584102' },
  { code: '040103', mandalCode: '0401', districtCode: '04', nameEn: 'Morampudi', nameTe: 'మోరంపూడి', censusCode: '584103' },

  // Kadiam (0402)
  { code: '040201', mandalCode: '0402', districtCode: '04', nameEn: 'Kadiam', nameTe: 'కడియం', censusCode: '584110' },
  { code: '040202', mandalCode: '0402', districtCode: '04', nameEn: 'Vemagiri', nameTe: 'వేమగిరి', censusCode: '584111' },
  { code: '040203', mandalCode: '0402', districtCode: '04', nameEn: 'Pottilanka', nameTe: 'పొట్టిలంక', censusCode: '584112' },

  // --- KURNOOL (13) ---
  // Kurnool Urban (1301)
  { code: '130101', mandalCode: '1301', districtCode: '13', nameEn: 'Kurnool', nameTe: 'కర్నూలు', censusCode: '591101' },
  { code: '130102', mandalCode: '1301', districtCode: '13', nameEn: 'Joharapuram', nameTe: 'జోహరాపురం', censusCode: '591102' },
  { code: '130103', mandalCode: '1301', districtCode: '13', nameEn: 'Mamidalapadu', nameTe: 'మామిడాలపాడు', censusCode: '591103' },

  // Nandyal (1302)
  { code: '130201', mandalCode: '1302', districtCode: '13', nameEn: 'Nandyal', nameTe: 'నంద్యాల', censusCode: '591110' },
  { code: '130202', mandalCode: '1302', districtCode: '13', nameEn: 'Ayalur', nameTe: 'అయలూరు', censusCode: '591111' },
  { code: '130203', mandalCode: '1302', districtCode: '13', nameEn: 'Rythunagaram', nameTe: 'రైతునగరం', censusCode: '591112' },

  // --- YSR KADAPA (11) ---
  // Kadapa Urban (1101)
  { code: '110101', mandalCode: '1101', districtCode: '11', nameEn: 'Kadapa', nameTe: 'కడప', censusCode: '593101' },
  { code: '110102', mandalCode: '1101', districtCode: '11', nameEn: 'Utukur', nameTe: 'ఉటుకూరు', censusCode: '593102' },
  { code: '110103', mandalCode: '1101', districtCode: '11', nameEn: 'Akkayapalle', nameTe: 'అక్కాయపల్లె', censusCode: '593103' },

  // Proddatur (1102)
  { code: '110201', mandalCode: '1102', districtCode: '11', nameEn: 'Proddatur', nameTe: 'ప్రొద్దుటూరు', censusCode: '593110' },
  { code: '110202', mandalCode: '1102', districtCode: '11', nameEn: 'Bolavaram', nameTe: 'బోలవరం', censusCode: '593111' },
  { code: '110203', mandalCode: '1102', districtCode: '11', nameEn: 'Modameedapalle', nameTe: 'మోదమీదపల్లె', censusCode: '593112' },

  // --- NELLORE (09) ---
  // Nellore Urban (0901)
  { code: '090101', mandalCode: '0901', districtCode: '09', nameEn: 'Nellore', nameTe: 'నెల్లూరు', censusCode: '592101' },
  { code: '090102', mandalCode: '0901', districtCode: '09', nameEn: 'Allipuram', nameTe: 'అల్లిపురం', censusCode: '592102' },
  { code: '090103', mandalCode: '0901', districtCode: '09', nameEn: 'Kallurpalle', nameTe: 'కల్లూరుపల్లె', censusCode: '592103' },

  // Kovur (0902)
  { code: '090201', mandalCode: '0902', districtCode: '09', nameEn: 'Kovur', nameTe: 'కోవూరు', censusCode: '592110' },
  { code: '090202', mandalCode: '0902', districtCode: '09', nameEn: 'Padugupadu', nameTe: 'పడుగుపాడు', censusCode: '592111' },
  { code: '090203', mandalCode: '0902', districtCode: '09', nameEn: 'Inamadugu', nameTe: 'ఇనమడుగు', censusCode: '592112' }
];

const seedDistricts = (adminDataset && Array.isArray(adminDataset.districts) && adminDataset.districts.length > 0)
  ? adminDataset.districts
  : fallbackDistricts;

const seedMandals = (adminDataset && Array.isArray(adminDataset.mandals) && adminDataset.mandals.length > 0)
  ? adminDataset.mandals
  : fallbackMandals;

const seedVillages = (adminDataset && Array.isArray(adminDataset.villages) && adminDataset.villages.length > 0)
  ? adminDataset.villages
  : fallbackVillages;

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
  },
  {
    districtCode: '07',
    districtNameEn: 'Guntur',
    districtNameTe: 'గుంటూరు',
    mandalCode: '0704',
    mandalNameEn: 'Amaravati',
    mandalNameTe: 'అమరావతి',
    villageCode: '070401',
    villageNameEn: 'Amaravati',
    villageNameTe: 'అమరావతి',
    surveyNo: '88',
    subDivisionNo: '2',
    lpNo: 'LP/07/0704/88-2',
    khataNo: '220',
    pattadarNameEn: 'Chalasani Rama Rao',
    pattadarNameTe: 'చలసాని రామారావు',
    fatherOrHusbandNameEn: 'Chalasani Subbaiah',
    fatherOrHusbandNameTe: 'చలసాని సుబ్బయ్య',
    cultivatorNameEn: 'Chalasani Rama Rao',
    cultivatorNameTe: 'చలసాని రామారావు',
    totalExtentAcres: 5.60,
    cultivableExtentAcres: 5.60,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Wet (మాగాణి)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Krishna River Ayacut (కృష్ణా నది ఆయకట్టు)',
    cropDetails: 'Banana / Turmeric (అరటి / పసుపు)',
    aadhaarSeeded: true,
    aadhaarLast4: '7721',
    passbookNumber: 'AP/PPB/2023/070401-220',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '87', south: '89', east: '88/3', west: '88/1' }
  },
  {
    districtCode: '10',
    districtNameEn: 'Chittoor',
    districtNameTe: 'చిత్తూరు',
    mandalCode: '1001',
    mandalNameEn: 'Tirupati Urban',
    mandalNameTe: 'తిరుపతి అర్బన్',
    villageCode: '100101',
    villageNameEn: 'Tirupati',
    villageNameTe: 'తిరుపతి',
    surveyNo: '42',
    subDivisionNo: '1',
    lpNo: 'LP/10/1001/42-1',
    khataNo: '150',
    pattadarNameEn: 'Rayapati Venkatesh',
    pattadarNameTe: 'రాయపాటి వెంకటేష్',
    fatherOrHusbandNameEn: 'Rayapati Govindappa',
    fatherOrHusbandNameTe: 'రాయపాటి గోవిందప్ప',
    cultivatorNameEn: 'Rayapati Venkatesh',
    cultivatorNameTe: 'రాయపాటి వెంకటేష్',
    totalExtentAcres: 2.15,
    cultivableExtentAcres: 2.15,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Borewell (బోరు బావి)',
    cropDetails: 'Groundnut / Mango (వేరుశనగ / మామిడి)',
    aadhaarSeeded: true,
    aadhaarLast4: '3419',
    passbookNumber: 'AP/PPB/2023/100101-150',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '41', south: '43', east: '42/2', west: '40' }
  },
  {
    districtCode: '03',
    districtNameEn: 'Visakhapatnam',
    districtNameTe: 'విశాఖపట్నం',
    mandalCode: '0301',
    mandalNameEn: 'Anandapuram',
    mandalNameTe: 'ఆనందపురం',
    villageCode: '030101',
    villageNameEn: 'Anandapuram',
    villageNameTe: 'ఆనందపురం',
    surveyNo: '115',
    subDivisionNo: '3',
    lpNo: 'LP/03/0301/115-3',
    khataNo: '405',
    pattadarNameEn: 'Allu Satyanarayana',
    pattadarNameTe: 'అల్లు సత్యనారాయణ',
    fatherOrHusbandNameEn: 'Allu Apparao',
    fatherOrHusbandNameTe: 'అల్లు అప్పారావు',
    cultivatorNameEn: 'Allu Satyanarayana',
    cultivatorNameTe: 'అల్లు సత్యనారాయణ',
    totalExtentAcres: 3.40,
    cultivableExtentAcres: 3.40,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Dry (మెట్ట)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Rainfed (వర్షాధార)',
    cropDetails: 'Cashew / Maize (జీడిమామిడి / మొక్కజొన్న)',
    aadhaarSeeded: true,
    aadhaarLast4: '5562',
    passbookNumber: 'AP/PPB/2023/030101-405',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '114', south: '116', east: '115/4', west: '115/2' }
  },
  {
    districtCode: '04',
    districtNameEn: 'East Godavari',
    districtNameTe: 'తూర్పు గోదావరి',
    mandalCode: '0401',
    mandalNameEn: 'Rajamahendravaram Urban',
    mandalNameTe: 'రాజమహేంద్రవరం అర్బన్',
    villageCode: '040101',
    villageNameEn: 'Rajahmundry',
    villageNameTe: 'రాజమండ్రి',
    surveyNo: '90',
    subDivisionNo: '1',
    lpNo: 'LP/04/0401/90-1',
    khataNo: '105',
    pattadarNameEn: 'Gadiraju Suryanarayana Raju',
    pattadarNameTe: 'గదిరాజు సూర్యనారాయణ రాజు',
    fatherOrHusbandNameEn: 'Gadiraju Rama Raju',
    fatherOrHusbandNameTe: 'గదిరాజు రామ రాజు',
    cultivatorNameEn: 'Gadiraju Suryanarayana Raju',
    cultivatorNameTe: 'గదిరాజు సూర్యనారాయణ రాజు',
    totalExtentAcres: 1.95,
    cultivableExtentAcres: 1.95,
    uncultivableExtentAcres: 0.00,
    landClassification: 'Wet (మాగాణి)',
    landNature: 'Patta Land (రైత్వారీ పట్టా)',
    waterSource: 'Godavari Canal (గోదావరి కాలువ)',
    cropDetails: 'Paddy / Sugarcane (వరి / చెరకు)',
    aadhaarSeeded: true,
    aadhaarLast4: '8834',
    passbookNumber: 'AP/PPB/2023/040101-105',
    disputeStatus: 'Clear / No Dispute',
    neighboringSurveys: { north: '89', south: '91', east: '90/2', west: '88' }
  }
];

const seedApplications = [
  {
    applicationNo: 'MUT2026AP031189',
    applicantName: 'Rayapati Venkatesh',
    serviceType: 'Mutation for Transactions',
    districtName: 'Chittoor',
    mandalName: 'Tirupati Urban',
    villageName: 'Tirupati',
    surveyNo: '42/1',
    khataNo: '150',
    currentStatus: 'Approved',
    assignedOfficer: 'Tahsildar, Tirupati Urban',
    remarks: 'Mutation approved by Tahsildar. Digital passbook issued.'
  },
  {
    applicationNo: 'MUT2026AP042910',
    applicantName: 'Allu Satyanarayana',
    serviceType: 'Mutation for Inheritance',
    districtName: 'Visakhapatnam',
    mandalName: 'Anandapuram',
    villageName: 'Anandapuram',
    surveyNo: '115/3',
    khataNo: '405',
    currentStatus: 'VRO Verification Completed',
    assignedOfficer: 'VRO, Anandapuram',
    remarks: 'Legal heir certificates verified. Forwarded to Tahsildar for final sanction.'
  },
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
