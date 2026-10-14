const mongoose = require('mongoose');

const landRecordSchema = new mongoose.Schema({
  districtCode: { type: String, required: true, index: true },
  districtNameEn: { type: String, required: true },
  districtNameTe: { type: String, required: true },

  mandalCode: { type: String, required: true, index: true },
  mandalNameEn: { type: String, required: true },
  mandalNameTe: { type: String, required: true },

  villageCode: { type: String, required: true, index: true },
  villageNameEn: { type: String, required: true },
  villageNameTe: { type: String, required: true },

  surveyNo: { type: String, required: true, index: true },
  subDivisionNo: { type: String, default: '' },
  lpNo: { type: String, index: true },
  khataNo: { type: String, required: true, index: true },

  pattadarNameEn: { type: String, required: true, index: true },
  pattadarNameTe: { type: String, required: true },
  gender: { type: String, default: '' },
  fatherOrHusbandNameEn: { type: String, default: '' },
  fatherOrHusbandNameTe: { type: String, default: '' },
  displayFatherName: { type: String, default: '' },

  cultivatorNameEn: { type: String, default: '' },
  cultivatorNameTe: { type: String, default: '' },

  totalExtentAcres: { type: Number, required: true },
  extentDisplay: { type: String, default: '' },
  cultivableExtentAcres: { type: Number, default: 0 },
  uncultivableExtentAcres: { type: Number, default: 0 },

  landClassification: { 
    type: String, 
    default: 'Dry (మెట్ట)' 
  },
  landType: { 
    type: String, 
    default: 'మెట్ట' 
  },
  landNature: { 
    type: String, 
    default: 'Patta Land (రైత్వారీ పట్టా)' 
  },
  landTransferType: { 
    type: String, 
    default: 'డి పట్టా' 
  },
  mutationDate: { 
    type: String, 
    default: '---' 
  },
  dataSource: {
    type: String,
    default: 'demo',
    index: true
  },
  aliases: [{ type: String }],

  waterSource: { 
    type: String, 
    default: 'Rain-fed (వర్షాధారం)' 
  },
  cropDetails: {
    type: String,
    default: ''
  },

  aadhaarSeeded: { type: Boolean, default: false },
  aadhaarLast4: { type: String, default: '' },

  passbookNumber: { type: String, index: true },
  passbookIssuedDate: { type: Date, default: Date.now },

  disputeStatus: { 
    type: String, 
    default: 'Clear / No Dispute' 
  },

  lpMapSvg: { type: String },
  neighboringSurveys: {
    north: { type: String, default: '' },
    south: { type: String, default: '' },
    east: { type: String, default: '' },
    west: { type: String, default: '' }
  },

  isSimulatedDemo: { type: Boolean, default: true }
}, { timestamps: true });

// Compound indexes for high-speed revenue searches
landRecordSchema.index({ villageCode: 1, surveyNo: 1 });
landRecordSchema.index({ villageCode: 1, khataNo: 1 });
landRecordSchema.index({ villageCode: 1, subDivisionNo: 1 });
landRecordSchema.index({ districtCode: 1, mandalCode: 1, villageCode: 1 });
landRecordSchema.index({ villageCode: 1, pattadarNameEn: 1, pattadarNameTe: 1 });

module.exports = mongoose.model('LandRecord', landRecordSchema);

