const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: Boolean, default: false },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);