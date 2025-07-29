import express from 'express';
import KisiselYanitService from '../services/kisiselYanitService.js';

const router = express.Router();

// Kişiselleştirilmiş yanıt üret
router.post('/yanit-uret', async (req, res) => {
  try {
    const { childId, message, context = {} } = req.body;
    
    if (!childId || !message) {
      return res.status(400).json({
        success: false,
        message: 'childId ve message gerekli'
      });
    }
    
    const response = await KisiselYanitService.generatePersonalizedResponse(
      childId, 
      message, 
      context
    );
    
    res.json({
      success: true,
      response,
      childId,
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Yanıt üretme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt üretilirken hata oluştu',
      error: error.message
    });
  }
});

// Çocuk profili getir
router.get('/profil/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    const profile = await KisiselYanitService.getChildProfile(childId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil bulunamadı'
      });
    }
    
    res.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil getirilirken hata oluştu',
      error: error.message
    });
  }
});

// Profil oluştur/güncelle
router.post('/profil', async (req, res) => {
  try {
    const { childId, ...updates } = req.body;
    
    if (!childId) {
      return res.status(400).json({
        success: false,
        message: 'childId gerekli'
      });
    }
    
    const profile = await KisiselYanitService.updateChildProfile(childId, updates);
    
    res.json({
      success: true,
      profile,
      message: 'Profil başarıyla güncellendi'
    });
    
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken hata oluştu',
      error: error.message
    });
  }
});

// Tüm profilleri getir
router.get('/profiller', async (req, res) => {
  try {
    const profiles = await KisiselYanitService.getAllProfiles();
    
    res.json({
      success: true,
      profiles,
      count: profiles.length
    });
    
  } catch (error) {
    console.error('Profiller getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profiller getirilirken hata oluştu',
      error: error.message
    });
  }
});

// Profil sil
router.delete('/profil/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    const profile = await KisiselYanitService.deleteProfile(childId);
    
    res.json({
      success: true,
      message: 'Profil başarıyla silindi',
      profile
    });
    
  } catch (error) {
    console.error('Profil silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil silinirken hata oluştu',
      error: error.message
    });
  }
});

// Toplu yanıt üret (test için)
router.post('/toplu-yanit', async (req, res) => {
  try {
    const { messages, childId, context = {} } = req.body;
    
    if (!Array.isArray(messages) || !childId) {
      return res.status(400).json({
        success: false,
        message: 'messages array ve childId gerekli'
      });
    }
    
    const responses = [];
    
    for (const message of messages) {
      const response = await KisiselYanitService.generatePersonalizedResponse(
        childId,
        message,
        context
      );
      
      responses.push({
        message,
        response,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      responses,
      count: responses.length
    });
    
  } catch (error) {
    console.error('Toplu yanıt üretme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Toplu yanıt üretilirken hata oluştu',
      error: error.message
    });
  }
});

// İstatistikler
router.get('/istatistikler/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    const profile = await KisiselYanitService.getChildProfile(childId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil bulunamadı'
      });
    }
    
    const stats = {
      totalInteractions: profile.stats.totalInteractions,
      successfulMotivations: profile.stats.successfulMotivations,
      averageResponseTime: profile.stats.averageResponseTime,
      favoriteTopics: profile.stats.favoriteTopics,
      effectiveStrategies: profile.stats.effectiveStrategies,
      currentMood: profile.currentMood,
      currentXp: profile.currentXp,
      currentLevel: profile.currentLevel,
      lastActivities: profile.lastActivities.slice(-5) // Son 5 aktivite
    };
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler getirilirken hata oluştu',
      error: error.message
    });
  }
});

// Yaş grubu önerileri
router.get('/yas-onerileri/:ageGroup', (req, res) => {
  try {
    const { ageGroup } = req.params;
    
    const templates = KisiselYanitService.getAgeBasedTemplates(ageGroup);
    
    res.json({
      success: true,
      ageGroup,
      templates
    });
    
  } catch (error) {
    console.error('Yaş önerileri hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yaş önerileri getirilirken hata oluştu',
      error: error.message
    });
  }
});

// Öğrenme stili önerileri
router.get('/ogrenme-stili/:style', (req, res) => {
  try {
    const { style } = req.params;
    
    const strategies = KisiselYanitService.getLearningStyleStrategies(style);
    
    res.json({
      success: true,
      learningStyle: style,
      strategies
    });
    
  } catch (error) {
    console.error('Öğrenme stili hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Öğrenme stili önerileri getirilirken hata oluştu',
      error: error.message
    });
  }
});

export default router; 