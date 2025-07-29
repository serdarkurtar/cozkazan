import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['child', 'parent', 'admin'], 
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number },
  grade: { type: String }, // Çocuklar için sınıf
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Çocuklar için veli ID
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Veliler için çocuk ID'leri
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'tr' },
    theme: { type: String, default: 'light' }
  }
}, { timestamps: true });

// İndeksler
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ parentId: 1 });

export default mongoose.model('User', UserSchema); 