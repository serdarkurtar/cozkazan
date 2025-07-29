import mongoose from 'mongoose';

const SoruSchema = new mongoose.Schema({
  soruMetni: { type: String, required: true },
  secenekA: { type: String, required: true },
  secenekB: { type: String, required: true },
  secenekC: { type: String, required: true },
  secenekD: { type: String }, // 4 şıklı olmak zorunda değil
  dogruCevap: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true }
}, { timestamps: true });

export default mongoose.model('Soru', SoruSchema); 