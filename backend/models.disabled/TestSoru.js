import mongoose from 'mongoose';

const TestSoruSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  soruMetni: { type: String, required: true },
  secenekler: { type: [String], required: true },
  dogruSecenek: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('TestSoru', TestSoruSchema); 