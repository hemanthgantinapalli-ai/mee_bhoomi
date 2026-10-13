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
  subDivisionNo: { type: String, default: '1' },
  lpNo: { type: String, index: true },
  khataNo: { type: String, required: true, index: true },

  pattadarNameEn: { type: String, required: true, index: true },
  pattadarNameTe: { type: String, required: true },
  fatherOrHusbandNameEn: { type: String, required: true },
  fatherOrHusbandNameTe: { type: String, required: true },

  cultivatorNameEn: { type: String, default: '' },
  cultivatorNameTe: { type: String, default: '' },

  totalExtentAcres: { type: Number, required: true },
  cultivableExtentAcres: { type: Number, required: true },
  uncultivableExtentAcres: { type: Number, default: 0 },

  landClassification: { 
    type: String, 
    enum: ['Dry (మెట్ట)', 'Wet (మాగాణి)', 'Garden (తోట)'],
    default: 'Dry (మెట్ట)' 
  },
  landNature: { 
    type: String, 
    default: 'Patta Land (రైత్వారీ పట్టా)' 
  },
  waterSource: { 
    type: String, 
    default: 'Borewell (బోరు బావి)' 
  },
  cropDetails: {
    type: String,
    default: 'Paddy / Cotton (వరి / పత్తి)'
  },

  aadhaarSeeded: { type: Boolean, default: true },
  aadhaarLast4: { type: String, default: '5421' },

  passbookNumber: { type: String, index: true },
  passbookIssuedDate: { type: Date, default: Date.now },

  disputeStatus: { 
    type: String, 
    enum: ['Clear / No Dispute', 'Civil Dispute Pending', 'Court Injunction'],
    default: 'Clear / No Dispute' 
  },

  lpMapSvg: { type: String }, // SVG path or polygon data for LP Map
  neighboringSurveys: {
    north: { type: String, default: '124/1' },
    south: { type: String, default: '126/3' },
    east: { type: String, default: '125/2' },
    west: { type: String, default: '122' }
  },

  isSimulatedDemo: { type: Boolean, default: true }
}, { timestamps: true });

// Compound indexes for high-speed revenue searches
landRecordSchema.index({ villageCode: 1, surveyNo: 1 });
landRecordSchema.index({ villageCode: 1, khataNo: 1 });
landRecordSchema.index({ villageCode: 1, pattadarNameEn: 'text', pattadarNameTe: 'text' });

module.exports = mongoose.model('LandRecord', landRecordSchema);
