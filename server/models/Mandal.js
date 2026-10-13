const mongoose = require('mongoose');

const mandalSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  nameEn: { type: String, required: true },
  nameTe: { type: String, required: true },
  districtCode: { type: String, required: true, index: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

mandalSchema.index({ districtCode: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Mandal', mandalSchema);
