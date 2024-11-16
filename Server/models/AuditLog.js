const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'CREATE', 'UPDATE', 'DELETE'
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: false },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }, // Additional information, like changed fields or previous values
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
