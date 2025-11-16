import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: 'Title is required' },
  description: { type: String, trim: true, required: 'Description is required' },
  checklist: [{ type: String, trim: true }],
  icon: { type: String, trim: true }, // e.g. gamepad, code, robot, compass
  color: { type: String, trim: true }, // e.g. amber, blue, green
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);
