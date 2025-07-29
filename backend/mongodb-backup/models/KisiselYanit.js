import mongoose from 'mongoose';

const KisiselYanitSchema = new mongoose.Schema({
  // Kullanıcı bilgileri
  childId: { type: String, required: true },
  childName: { type: String, required: true },
  userType: { type: String, enum: ['child', 'parent'], required: true, default: 'child' },
  
  // Yaş grubu (sadece çocuklar için, veliler için opsiyonel)
  ageGroup: { 
    type: String, 
    enum: ['5-7', '8-10', '11-13', '14-16', 'adult'], 
    required: function() { return this.userType === 'child'; }
  },
  
  // Veli yaş grubu (sadece veliler için)
  parentAgeGroup: {
    type: String,
    enum: ['25-35', '36-45', '46-55', '56+'],
    required: function() { return this.userType === 'parent'; }
  },
  
  // Öğrenme stili (çocuklar için) / İletişim stili (veliler için)
  learningStyle: { 
    type: String, 
    enum: ['visual', 'auditory', 'kinesthetic', 'mixed'], 
    required: function() { return this.userType === 'child'; }
  },
  
  communicationStyle: {
    type: String,
    enum: ['direct', 'supportive', 'analytical', 'empathetic', 'mixed'],
    required: function() { return this.userType === 'parent'; }
  },
  
  // Veli tercihleri (çocuklar için) / Ebeveynlik tercihleri (veliler için)
  parentPreferences: [{
    type: String, 
    enum: ['motivation_focus', 'behavior_focus', 'academic_focus', 'social_focus', 'creative_focus']
  }],
  
  parentingPreferences: [{
    type: String,
    enum: ['strict_discipline', 'gentle_guidance', 'academic_pressure', 'emotional_support', 'independence_focus', 'safety_focus', 'social_development', 'creative_expression']
  }],
  
  // Çocuğun mevcut durumu (sadece çocuklar için)
  currentXp: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  currentMood: { 
    type: String, 
    enum: ['happy', 'sad', 'tired', 'excited', 'frustrated', 'bored', 'neutral'], 
    default: 'neutral' 
  },
  
  // Veli durumu (sadece veliler için)
  parentStressLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium'
  },
  
  parentExperience: {
    type: String,
    enum: ['new_parent', 'experienced', 'expert'],
    default: 'experienced'
  },
  
  // Son aktiviteler
  lastActivities: [{
    activity: String,
    timestamp: { type: Date, default: Date.now },
    success: Boolean
  }],
  
  // Kişiselleştirilmiş yanıt şablonları
  responseTemplates: {
    motivation: {
      low: String,
      medium: String,
      high: String
    },
    encouragement: {
      academic: String,
      social: String,
      creative: String
    },
    guidance: {
      visual: String,
      auditory: String,
      kinesthetic: String
    },
    // Veli için ek şablonlar
    parenting: {
      discipline: String,
      support: String,
      guidance: String
    },
    stress_management: {
      low: String,
      medium: String,
      high: String
    }
  },
  
  // Özel tercihler
  preferences: {
    emojiUsage: { type: Boolean, default: true },
    storyUsage: { type: Boolean, default: true },
    challengeLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    rewardStyle: { type: String, enum: ['immediate', 'delayed', 'mixed'], default: 'immediate' },
    // Veli için ek tercihler
    adviceStyle: { type: String, enum: ['direct', 'suggestive', 'questioning'], default: 'suggestive' },
    detailLevel: { type: String, enum: ['brief', 'detailed', 'comprehensive'], default: 'detailed' }
  },
  
  // İstatistikler
  stats: {
    totalInteractions: { type: Number, default: 0 },
    successfulMotivations: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    favoriteTopics: [String],
    effectiveStrategies: [String]
  },
  
  // Son güncelleme
  lastUpdated: { type: Date, default: Date.now },
  
  // Aktif durum
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

// İndeksler
KisiselYanitSchema.index({ childId: 1 });
KisiselYanitSchema.index({ userType: 1 });
KisiselYanitSchema.index({ ageGroup: 1, learningStyle: 1 });
KisiselYanitSchema.index({ parentAgeGroup: 1, communicationStyle: 1 });
KisiselYanitSchema.index({ currentMood: 1 });
KisiselYanitSchema.index({ parentStressLevel: 1 });

export default mongoose.model('KisiselYanit', KisiselYanitSchema); 