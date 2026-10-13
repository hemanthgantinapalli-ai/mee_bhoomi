const mongoose = require('mongoose');

const applicationStatusSchema = new mongoose.Schema({
  applicationNo: { type: String, required: true, unique: true, index: true },
  applicantName: { type: String, required: true },
  serviceType: { 
    type: String, 
    required: true,
    enum: [
      'Mutation for Transactions',
      'Mutation for Correction',
      'Aadhar Seeding',
      'Land Conversion For Non Agriculture Purpose',
      'Water Tax Assessment',
      'Auto Mutation'
    ]
  },
  districtName: { type: String, required: true },
  mandalName: { type: String, required: true },
  villageName: { type: String, required: true },
  surveyNo: { type: String, required: true },
  khataNo: { type: String },
  submissionDate: { type: Date, default: Date.now },
  currentStatus: { 
    type: String, 
    enum: ['Submitted', 'VRO Verification Completed', 'Tahsildar Approval In Progress', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  assignedOfficer: { type: String, default: 'Village Revenue Officer (VRO)' },
  remarks: { type: String, default: 'Application is under active verification at Grama Sachivalayam.' },
  completedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ApplicationStatus', applicationStatusSchema);
