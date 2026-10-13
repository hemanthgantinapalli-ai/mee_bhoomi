const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  nameEn: { type: String, required: true },
  nameTe: { type: String, required: true },
  headquarters: { type: String },
  region: { type: String, default: 'Andhra Pradesh' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('District', districtSchema);
