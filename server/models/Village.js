const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  nameEn: { type: String, required: true },
  nameTe: { type: String, required: true },
  mandalCode: { type: String, required: true, index: true },
  districtCode: { type: String, required: true, index: true },
  mandalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandal' },
  censusCode: { type: String },
  totalAreaAcres: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

villageSchema.index({ mandalCode: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Village', villageSchema);
