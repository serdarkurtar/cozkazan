import KisiselYanit from '../models/KisiselYanit.js';

class KisiselYanitService {
  
  // Yaş grubuna göre yanıt şablonları
  static getAgeBasedTemplates(ageGroup) {
    const templates = {
      '5-7': {
        language: 'simple',
        sentenceLength: 'short',
        emojiUsage: 'high',
        storyElements: 'frequent',
        repetition: 'helpful',
        examples: 'concrete'
      },
      '8-10': {
        language: 'moderate',
        sentenceLength: 'medium',
        emojiUsage: 'moderate',
        storyElements: 'occasional',
        repetition: 'minimal',
        examples: 'mixed'
      },
      '11-13': {
        language: 'complex',
        sentenceLength: 'long',
        emojiUsage: 'low',
        storyElements: 'rare',
        repetition: 'avoid',
        examples: 'abstract'
      },
      '14-16': {
        language: 'adult',
        sentenceLength: 'variable',
        emojiUsage: 'minimal',
        storyElements: 'none',
        repetition: 'avoid',
        examples: 'realistic'
      }
    };
    
    return templates[ageGroup] || templates['8-10'];
  }

  // Öğrenme stiline göre yanıt stratejileri
  static getLearningStyleStrategies(learningStyle) {
    const strategies = {
      'visual': {
        description: 'görsel',
        techniques: ['resim', 'renk', 'şekil', 'grafik', 'video'],
        phrases: ['görebilirsin', 'bak', 'görsel olarak', 'resim gibi'],
        activities: ['çizim yap', 'resim çiz', 'grafik oluştur', 'renkli notlar al']
      },
      'auditory': {
        description: 'işitsel',
        techniques: ['ses', 'müzik', 'konuşma', 'şarkı', 'ritim'],
        phrases: ['duyabilirsin', 'sesli oku', 'şarkı söyle', 'ritim tut'],
        activities: ['sesli oku', 'şarkı söyle', 'anlat', 'dinle']
      },
      'kinesthetic': {
        description: 'kinestetik',
        techniques: ['hareket', 'dokunma', 'oyun', 'dans', 'spor'],
        phrases: ['hareket et', 'dokun', 'oyna', 'dans et', 'spor yap'],
        activities: ['oyun oyna', 'dans et', 'spor yap', 'el işi yap']
      },
      'mixed': {
        description: 'karma',
        techniques: ['çoklu', 'entegre', 'dengeli', 'esnek'],
        phrases: ['farklı yollarla', 'çeşitli şekillerde', 'dengeli olarak'],
        activities: ['çeşitli aktiviteler', 'farklı yöntemler', 'karma yaklaşım']
      }
    };
    
    return strategies[learningStyle] || strategies['mixed'];
  }

  // Veli yaş grubuna göre yanıt şablonları
  static getParentAgeBasedTemplates(parentAgeGroup) {
    const templates = {
      '25-35': {
        language: 'modern',
        sentenceLength: 'medium',
        emojiUsage: 'moderate',
        referenceStyle: 'contemporary',
        examples: 'current_trends',
        tone: 'supportive_peer'
      },
      '36-45': {
        language: 'balanced',
        sentenceLength: 'medium',
        emojiUsage: 'low',
        referenceStyle: 'practical',
        examples: 'real_life',
        tone: 'experienced_guide'
      },
      '46-55': {
        language: 'mature',
        sentenceLength: 'long',
        emojiUsage: 'minimal',
        referenceStyle: 'traditional',
        examples: 'proven_methods',
        tone: 'wise_advisor'
      },
      '56+': {
        language: 'respectful',
        sentenceLength: 'variable',
        emojiUsage: 'none',
        referenceStyle: 'time_tested',
        examples: 'classic_approaches',
        tone: 'respectful_expert'
      }
    };
    
    return templates[parentAgeGroup] || templates['36-45'];
  }

  // İletişim stiline göre yanıt stratejileri
  static getCommunicationStyleStrategies(communicationStyle) {
    const strategies = {
      'direct': {
        description: 'doğrudan',
        techniques: ['açık', 'net', 'kesin', 'direkt'],
        phrases: ['doğrudan söyleyeyim', 'açıkça belirtmek gerekirse', 'net olmak gerekirse'],
        approach: 'straightforward_advice'
      },
      'supportive': {
        description: 'destekleyici',
        techniques: ['anlayış', 'destek', 'cesaretlendirme', 'güven'],
        phrases: ['sizi anlıyorum', 'bu normal bir durum', 'birlikte çözeriz'],
        approach: 'emotional_support'
      },
      'analytical': {
        description: 'analitik',
        techniques: ['analiz', 'veri', 'mantık', 'sistem'],
        phrases: ['analiz edelim', 'mantıklı olan', 'sistematik yaklaşım'],
        approach: 'logical_analysis'
      },
      'empathetic': {
        description: 'empatik',
        techniques: ['duygu', 'anlayış', 'hissiyat', 'bağlantı'],
        phrases: ['hissettiğinizi anlıyorum', 'bu zor bir durum', 'sizinle aynı fikirdeyim'],
        approach: 'emotional_connection'
      },
      'mixed': {
        description: 'karma',
        techniques: ['dengeli', 'esnek', 'uyarlanabilir', 'çok yönlü'],
        phrases: ['farklı açılardan bakalım', 'dengeli bir yaklaşım', 'esnek olalım'],
        approach: 'balanced_approach'
      }
    };
    
    return strategies[communicationStyle] || strategies['supportive'];
  }

  // Veli tercihlerine göre odak alanları
  static getParentPreferenceFocus(preferences) {
    const focusAreas = {
      'motivation_focus': {
        priority: 'motivasyon',
        keywords: ['başarı', 'güç', 'kahraman', 'süper', 'harika'],
        rewards: ['XP', 'ödül', 'başarı rozeti', 'gurur'],
        approach: 'positive_reinforcement'
      },
      'behavior_focus': {
        priority: 'davranış',
        keywords: ['düzen', 'sorumluluk', 'alışkanlık', 'tutarlılık'],
        rewards: ['sorumluluk', 'güven', 'özerklik', 'saygı'],
        approach: 'behavior_modification'
      },
      'academic_focus': {
        priority: 'akademik',
        keywords: ['öğrenme', 'bilgi', 'başarı', 'gelişim', 'ilerleme'],
        rewards: ['bilgi', 'anlayış', 'beceri', 'uzmanlık'],
        approach: 'skill_development'
      },
      'social_focus': {
        priority: 'sosyal',
        keywords: ['arkadaş', 'paylaşım', 'işbirliği', 'empati', 'iletişim'],
        rewards: ['arkadaşlık', 'sosyal beceriler', 'popülerlik'],
        approach: 'social_development'
      },
      'creative_focus': {
        priority: 'yaratıcılık',
        keywords: ['hayal gücü', 'yaratıcılık', 'sanat', 'icat', 'keşif'],
        rewards: ['yaratıcılık', 'sanat', 'keşif', 'icat'],
        approach: 'creative_expression'
      }
    };
    
    return preferences.map(pref => focusAreas[pref]).filter(Boolean);
  }

  // Ebeveynlik tercihlerine göre odak alanları
  static getParentingPreferenceFocus(preferences) {
    const focusAreas = {
      'strict_discipline': {
        priority: 'disiplin',
        keywords: ['kural', 'sınır', 'tutarlılık', 'sorumluluk', 'düzen'],
        rewards: ['saygı', 'düzen', 'sorumluluk', 'başarı'],
        approach: 'structured_discipline'
      },
      'gentle_guidance': {
        priority: 'yumuşak rehberlik',
        keywords: ['anlayış', 'sabır', 'yönlendirme', 'destek', 'güven'],
        rewards: ['güven', 'özgüven', 'bağımsızlık', 'mutluluk'],
        approach: 'gentle_guidance'
      },
      'academic_pressure': {
        priority: 'akademik başarı',
        keywords: ['başarı', 'çalışma', 'hedef', 'performans', 'gelecek'],
        rewards: ['başarı', 'kariyer', 'gelecek', 'gurur'],
        approach: 'academic_excellence'
      },
      'emotional_support': {
        priority: 'duygusal destek',
        keywords: ['duygu', 'anlayış', 'destek', 'güven', 'sevgi'],
        rewards: ['mutluluk', 'güven', 'sağlıklı ilişki', 'özgüven'],
        approach: 'emotional_nurturing'
      },
      'independence_focus': {
        priority: 'bağımsızlık',
        keywords: ['özgürlük', 'bağımsızlık', 'karar', 'sorumluluk', 'özerklik'],
        rewards: ['bağımsızlık', 'özgüven', 'sorumluluk', 'olgunluk'],
        approach: 'independence_development'
      },
      'safety_focus': {
        priority: 'güvenlik',
        keywords: ['güvenlik', 'koruma', 'dikkat', 'güvenli', 'emniyet'],
        rewards: ['güvenlik', 'huzur', 'koruma', 'sakinlik'],
        approach: 'safety_first'
      },
      'social_development': {
        priority: 'sosyal gelişim',
        keywords: ['arkadaş', 'sosyal', 'iletişim', 'paylaşım', 'işbirliği'],
        rewards: ['arkadaşlık', 'sosyal beceriler', 'popülerlik', 'mutluluk'],
        approach: 'social_skills'
      },
      'creative_expression': {
        priority: 'yaratıcılık',
        keywords: ['yaratıcılık', 'sanat', 'hayal gücü', 'keşif', 'icat'],
        rewards: ['yaratıcılık', 'sanat', 'keşif', 'mutluluk'],
        approach: 'creative_development'
      }
    };
    
    return preferences.map(pref => focusAreas[pref]).filter(Boolean);
  }

  // Ruh haline göre yanıt stratejisi
  static getMoodBasedStrategy(mood, ageGroup) {
    const strategies = {
      'happy': {
        tone: 'celebratory',
        emoji: '🎉🌟✨',
        approach: 'build_on_positive',
        suggestions: ['devam et', 'daha da iyi ol', 'başarılarını paylaş']
      },
      'sad': {
        tone: 'comforting',
        emoji: '🤗💙🌈',
        approach: 'emotional_support',
        suggestions: ['seni anlıyorum', 'her şey geçecek', 'birlikte çözeriz']
      },
      'tired': {
        tone: 'gentle',
        emoji: '😴💤🌙',
        approach: 'rest_encouragement',
        suggestions: ['dinlen', 'mola ver', 'yavaşla']
      },
      'excited': {
        tone: 'enthusiastic',
        emoji: '🚀⚡🎯',
        approach: 'channel_energy',
        suggestions: ['enerjini kullan', 'odaklan', 'hedefine git']
      },
      'frustrated': {
        tone: 'supportive',
        emoji: '💪🤝💡',
        approach: 'problem_solving',
        suggestions: ['birlikte çözelim', 'farklı yöntem dene', 'küçük adımlarla']
      },
      'bored': {
        tone: 'engaging',
        emoji: '🎮📚🎨',
        approach: 'stimulation',
        suggestions: ['yeni şeyler dene', 'oyun oyna', 'kitap oku']
      },
      'neutral': {
        tone: 'encouraging',
        emoji: '👍🌟💫',
        approach: 'motivation',
        suggestions: ['devam et', 'yeni hedefler koy', 'keşfet']
      }
    };
    
    return strategies[mood] || strategies['neutral'];
  }

  // Stres seviyesine göre yanıt stratejisi
  static getStressBasedStrategy(stressLevel, parentAgeGroup) {
    const strategies = {
      'low': {
        tone: 'encouraging',
        emoji: '😊👍💪',
        approach: 'maintain_positive',
        suggestions: ['devam edin', 'iyi gidiyorsunuz', 'pozitif kalın']
      },
      'medium': {
        tone: 'supportive',
        emoji: '🤗💙🌟',
        approach: 'gentle_support',
        suggestions: ['kendinize zaman ayırın', 'küçük adımlarla ilerleyin', 'destek alın']
      },
      'high': {
        tone: 'calming',
        emoji: '🧘‍♀️💆‍♀️🌿',
        approach: 'stress_relief',
        suggestions: ['derin nefes alın', 'mola verin', 'profesyonel destek düşünün']
      },
      'very_high': {
        tone: 'urgent_care',
        emoji: '🚨💝🤝',
        approach: 'immediate_support',
        suggestions: ['acil destek alın', 'profesyonel yardım', 'kendinizi öncelik yapın']
      }
    };
    
    return strategies[stressLevel] || strategies['medium'];
  }

  // Ebeveynlik deneyimine göre yanıt stratejisi
  static getExperienceBasedStrategy(experience) {
    const strategies = {
      'new_parent': {
        tone: 'educational',
        approach: 'basic_guidance',
        detailLevel: 'comprehensive',
        reassurance: 'high',
        examples: 'frequent'
      },
      'experienced': {
        tone: 'collaborative',
        approach: 'shared_experience',
        detailLevel: 'moderate',
        reassurance: 'moderate',
        examples: 'occasional'
      },
      'expert': {
        tone: 'consultative',
        approach: 'advanced_strategies',
        detailLevel: 'brief',
        reassurance: 'low',
        examples: 'minimal'
      }
    };
    
    return strategies[experience] || strategies['experienced'];
  }

  // Kişiselleştirilmiş yanıt üret
  static async generatePersonalizedResponse(childId, message, context = {}) {
    try {
      // Çocuk profilini getir
      let profile = await KisiselYanit.findOne({ childId });
      
      if (!profile) {
        // Varsayılan profil oluştur
        profile = await this.createDefaultProfile(childId, context);
      }
      
      // Mesaj analizi
      const messageAnalysis = this.analyzeMessage(message);
      
      // Kullanıcı tipine göre farklı stratejiler uygula
      if (profile.userType === 'parent') {
        return await this._generateParentResponse(message, messageAnalysis, profile, context);
      } else {
        return await this._generateChildResponse(message, messageAnalysis, profile, context);
      }
      
    } catch (error) {
      console.error('Kişiselleştirilmiş yanıt üretme hatası:', error);
      return this.getFallbackResponse(message);
    }
  }

  // Veli yanıtı üret
  static async _generateParentResponse(message, messageAnalysis, profile, context) {
    // Veli yaş grubu şablonları
    const parentAgeTemplates = this.getParentAgeBasedTemplates(profile.parentAgeGroup);
    
    // İletişim stili stratejileri
    const communicationStrategies = this.getCommunicationStyleStrategies(profile.communicationStyle);
    
    // Ebeveynlik tercihleri odakları
    const parentingFocuses = this.getParentingPreferenceFocus(profile.parentingPreferences);
    
    // Stres seviyesi stratejisi
    const stressStrategy = this.getStressBasedStrategy(profile.parentStressLevel, profile.parentAgeGroup);
    
    // Ebeveynlik deneyimi stratejisi
    const experienceStrategy = this.getExperienceBasedStrategy(profile.parentExperience);
    
    // Yanıt oluştur
    const response = this.buildParentResponse({
      message,
      messageAnalysis,
      profile,
      parentAgeTemplates,
      communicationStrategies,
      parentingFocuses,
      stressStrategy,
      experienceStrategy,
      context
    });
    
    // Profili güncelle
    await this.updateProfile(profile, message, response, messageAnalysis);
    
    return response;
  }

  // Çocuk yanıtı üret (mevcut sistem)
  static async _generateChildResponse(message, messageAnalysis, profile, context) {
    // Yaş grubu şablonları
    const ageTemplates = this.getAgeBasedTemplates(profile.ageGroup);
    
    // Öğrenme stili stratejileri
    const learningStrategies = this.getLearningStyleStrategies(profile.learningStyle);
    
    // Veli tercihleri odakları
    const parentFocuses = this.getParentPreferenceFocus(profile.parentPreferences);
    
    // Ruh hali stratejisi
    const moodStrategy = this.getMoodBasedStrategy(profile.currentMood, profile.ageGroup);
    
    // Yanıt oluştur
    const response = this.buildResponse({
      message,
      messageAnalysis,
      profile,
      ageTemplates,
      learningStrategies,
      parentFocuses,
      moodStrategy,
      context
    });
    
    // Profili güncelle
    await this.updateProfile(profile, message, response, messageAnalysis);
    
    return response;
  }

  // Yanıt oluştur
  static buildResponse(params) {
    const {
      message,
      messageAnalysis,
      profile,
      ageTemplates,
      learningStrategies,
      parentFocuses,
      moodStrategy,
      context
    } = params;

    // Temel yanıt şablonu
    let response = this.getBaseResponse(messageAnalysis.topic, profile);
    
    // Yaş grubuna göre uyarla
    response = this.adaptForAge(response, ageTemplates);
    
    // Öğrenme stiline göre uyarla
    response = this.adaptForLearningStyle(response, learningStrategies);
    
    // Veli tercihlerine göre uyarla
    response = this.adaptForParentPreferences(response, parentFocuses);
    
    // Ruh haline göre uyarla
    response = this.adaptForMood(response, moodStrategy);
    
    // Kişiselleştir
    response = this.personalize(response, profile, context);
    
    return response;
  }

  // Veli yanıtı oluştur
  static buildParentResponse(params) {
    const {
      message,
      messageAnalysis,
      profile,
      parentAgeTemplates,
      communicationStrategies,
      parentingFocuses,
      stressStrategy,
      experienceStrategy,
      context
    } = params;

    // Temel yanıt şablonu
    let response = this.getParentBaseResponse(messageAnalysis.topic, profile);
    
    // Veli yaş grubuna göre uyarla
    response = this.adaptForParentAge(response, parentAgeTemplates);
    
    // İletişim stiline göre uyarla
    response = this.adaptForCommunicationStyle(response, communicationStrategies);
    
    // Ebeveynlik tercihlerine göre uyarla
    response = this.adaptForParentingPreferences(response, parentingFocuses);
    
    // Stres seviyesine göre uyarla
    response = this.adaptForStressLevel(response, stressStrategy);
    
    // Deneyim seviyesine göre uyarla
    response = this.adaptForExperience(response, experienceStrategy);
    
    // Kişiselleştir
    response = this.personalizeParentResponse(response, profile, context);
    
    return response;
  }

  // Temel yanıt şablonu
  static getBaseResponse(topic, profile) {
    const baseResponses = {
      'test': {
        positive: 'Test çözmek harika bir aktivite! Her test seni daha akıllı yapıyor.',
        negative: 'Testler zor olabilir ama her zorluk seni güçlendirir.',
        neutral: 'Test çözmeye devam et, başarıların artacak!'
      },
      'reading': {
        positive: 'Kitap okumak seni farklı dünyalara götürür!',
        negative: 'Kitap okuma alışkanlığı zamanla gelişir.',
        neutral: 'Kitap okumaya devam et, hayal gücün gelişecek!'
      },
      'gaming': {
        positive: 'Oyun oynamak eğlenceli ama dengeli olmak önemli.',
        negative: 'Oyun yerine başka aktiviteler de dene.',
        neutral: 'Oyun ve çalışma dengesini koru!'
      },
      'motivation': {
        positive: 'Sen harika bir çocuksun! Her gün daha iyi oluyorsun.',
        negative: 'Zorluklar geçici, sen güçlüsün!',
        neutral: 'Küçük adımlarla büyük başarılar elde ederiz!'
      }
    };
    
    const topicResponse = baseResponses[topic] || baseResponses['motivation'];
    return topicResponse.neutral; // Varsayılan olarak neutral
  }

  // Veli temel yanıt şablonu
  static getParentBaseResponse(topic, profile) {
    const baseResponses = {
      'discipline': {
        positive: 'Disiplin konusunda tutarlılık çok önemli. Kurallarınızı net bir şekilde belirleyin.',
        negative: 'Disiplin zor olabilir ama sabırlı olun. Tutarlılık anahtardır.',
        neutral: 'Disiplin konusunda dengeli bir yaklaşım benimseyin.'
      },
      'education': {
        positive: 'Eğitim konusunda çocuğunuzun ilgi alanlarını destekleyin.',
        negative: 'Eğitim baskısı yerine motivasyon odaklı yaklaşın.',
        neutral: 'Eğitimde çocuğunuzun hızına uyum sağlayın.'
      },
      'behavior': {
        positive: 'Davranış değişiklikleri zaman alır, sabırlı olun.',
        negative: 'Zorlu davranışlar için profesyonel destek düşünebilirsiniz.',
        neutral: 'Davranış konusunda pozitif yaklaşım benimseyin.'
      },
      'stress': {
        positive: 'Stres yönetimi için kendinize zaman ayırın.',
        negative: 'Yüksek stres durumunda destek almayı düşünün.',
        neutral: 'Stresle başa çıkmak için sağlıklı yöntemler bulun.'
      },
      'social': {
        positive: 'Sosyal gelişim için çocuğunuzu destekleyin.',
        negative: 'Sosyal zorluklar için anlayışlı olun.',
        neutral: 'Sosyal becerileri geliştirmek için fırsatlar yaratın.'
      }
    };
    
    const topicResponse = baseResponses[topic] || baseResponses['education'];
    return topicResponse.neutral;
  }

  // Yaş grubuna göre uyarla
  static adaptForAge(response, ageTemplates) {
    if (ageTemplates.language === 'simple') {
      response = response.replace(/[a-zA-ZğüşıöçĞÜŞİÖÇ]{8,}/g, (match) => {
        // Uzun kelimeleri kısalt
        const shortWords = {
          'harika': 'güzel',
          'mükemmel': 'süper',
          'başarılı': 'iyi',
          'geliştir': 'geliş',
          'aktivite': 'iş'
        };
        return shortWords[match] || match;
      });
    }
    
    if (ageTemplates.emojiUsage === 'high') {
      response += ' 🌟';
    } else if (ageTemplates.emojiUsage === 'moderate') {
      response += ' 👍';
    }
    
    return response;
  }

  // Veli yaş grubuna göre uyarla
  static adaptForParentAge(response, parentAgeTemplates) {
    if (parentAgeTemplates.language === 'modern') {
      response = response.replace(/[a-zA-ZğüşıöçĞÜŞİÖÇ]{8,}/g, (match) => {
        // Modern kelimeler kullan
        const modernWords = {
          'disiplin': 'sınır koyma',
          'eğitim': 'öğrenme süreci',
          'davranış': 'tutum',
          'stres': 'baskı',
          'sosyal': 'toplumsal'
        };
        return modernWords[match] || match;
      });
    }
    
    if (parentAgeTemplates.emojiUsage === 'moderate') {
      response += ' 💪';
    } else if (parentAgeTemplates.emojiUsage === 'low') {
      response += ' 👍';
    }
    
    return response;
  }

  // Öğrenme stiline göre uyarla
  static adaptForLearningStyle(response, strategies) {
    const technique = strategies.techniques[Math.floor(Math.random() * strategies.techniques.length)];
    const phrase = strategies.phrases[Math.floor(Math.random() * strategies.phrases.length)];
    
    response = response.replace(/\.$/, '');
    response += ` ${phrase} ${technique} kullanabilirsin.`;
    
    return response;
  }

  // İletişim stiline göre uyarla
  static adaptForCommunicationStyle(response, strategies) {
    const technique = strategies.techniques[Math.floor(Math.random() * strategies.techniques.length)];
    const phrase = strategies.phrases[Math.floor(Math.random() * strategies.phrases.length)];
    
    response = response.replace(/\.$/, '');
    response += ` ${phrase} ${technique} yaklaşımı kullanabilirsiniz.`;
    
    return response;
  }

  // Veli tercihlerine göre uyarla
  static adaptForParentPreferences(response, focuses) {
    if (focuses.length === 0) return response;
    
    const focus = focuses[0]; // İlk tercihi kullan
    const keyword = focus.keywords[Math.floor(Math.random() * focus.keywords.length)];
    
    response = response.replace(/\.$/, '');
    response += ` Bu senin ${keyword} alanında gelişmeni sağlar.`;
    
    return response;
  }

  // Ebeveynlik tercihlerine göre uyarla
  static adaptForParentingPreferences(response, focuses) {
    if (focuses.length === 0) return response;
    
    const focus = focuses[0];
    const keyword = focus.keywords[Math.floor(Math.random() * focus.keywords.length)];
    
    response = response.replace(/\.$/, '');
    response += ` Bu yaklaşım ${keyword} alanında çocuğunuzun gelişimini destekler.`;
    
    return response;
  }

  // Ruh haline göre uyarla
  static adaptForMood(response, moodStrategy) {
    response = response.replace(/\.$/, '');
    response += ` ${moodStrategy.emoji}`;
    
    return response;
  }

  // Stres seviyesine göre uyarla
  static adaptForStressLevel(response, stressStrategy) {
    response = response.replace(/\.$/, '');
    response += ` ${stressStrategy.emoji}`;
    
    const suggestion = stressStrategy.suggestions[Math.floor(Math.random() * stressStrategy.suggestions.length)];
    response += ` ${suggestion}.`;
    
    return response;
  }

  // Deneyim seviyesine göre uyarla
  static adaptForExperience(response, experienceStrategy) {
    if (experienceStrategy.detailLevel === 'comprehensive') {
      response = response.replace(/\.$/, '');
      response += ' Detaylı bilgi için uzman desteği alabilirsiniz.';
    } else if (experienceStrategy.detailLevel === 'brief') {
      response = response.replace(/\.$/, '');
      response += ' Deneyimlerinizi paylaşmaya devam edin.';
    }
    
    return response;
  }

  // Kişiselleştir
  static personalize(response, profile, context) {
    // İsim kullan
    if (profile.childName) {
      response = response.replace(/sen/g, `${profile.childName}`);
    }
    
    // XP bilgisi ekle
    if (profile.currentXp > 0) {
      response = response.replace(/\.$/, '');
      response += ` ${profile.currentXp} XP'n var, bu harika!`;
    }
    
    // Bağlam bilgisi ekle
    if (context.currentActivity) {
      response = response.replace(/\.$/, '');
      response += ` ${context.currentActivity} konusunda da başarılı olacaksın.`;
    }
    
    return response;
  }

  // Veli yanıtını kişiselleştir
  static personalizeParentResponse(response, profile, context) {
    // İsim kullan
    if (profile.childName) {
      response = response.replace(/çocuğunuz/g, `${profile.childName}`);
    }
    
    // Stres seviyesi bilgisi ekle
    if (profile.parentStressLevel === 'high' || profile.parentStressLevel === 'very_high') {
      response = response.replace(/\.$/, '');
      response += ' Stres seviyenizi düşürmek için kendinize zaman ayırın.';
    }
    
    // Deneyim bilgisi ekle
    if (profile.parentExperience === 'new_parent') {
      response = response.replace(/\.$/, '');
      response += ' Yeni ebeveynlik deneyiminizde sabırlı olun.';
    }
    
    return response;
  }

  // Varsayılan profil oluştur
  static async createDefaultProfile(childId, context = {}) {
    const userType = context.userType || 'child';
    
    const defaultProfile = new KisiselYanit({
      childId,
      childName: context.childName || (userType === 'child' ? 'Çocuk' : 'Veli'),
      userType,
      
      // Çocuk için varsayılan değerler
      ...(userType === 'child' && {
        ageGroup: context.ageGroup || '8-10',
        learningStyle: context.learningStyle || 'mixed',
        parentPreferences: context.parentPreferences || ['motivation_focus'],
        currentXp: context.currentXp || 0,
        currentLevel: context.currentLevel || 1,
        currentMood: context.currentMood || 'neutral'
      }),
      
      // Veli için varsayılan değerler
      ...(userType === 'parent' && {
        parentAgeGroup: context.parentAgeGroup || '36-45',
        communicationStyle: context.communicationStyle || 'supportive',
        parentingPreferences: context.parentingPreferences || ['gentle_guidance'],
        parentStressLevel: context.parentStressLevel || 'medium',
        parentExperience: context.parentExperience || 'experienced'
      })
    });
    
    return await defaultProfile.save();
  }

  // Profili güncelle
  static async updateProfile(profile, message, response, analysis) {
    profile.stats.totalInteractions += 1;
    profile.lastUpdated = new Date();
    
    // Son aktiviteleri güncelle
    profile.lastActivities.push({
      activity: analysis.topic,
      timestamp: new Date(),
      success: analysis.emotion !== 'frustrated' && analysis.emotion !== 'sad'
    });
    
    // Son 10 aktiviteyi tut
    if (profile.lastActivities.length > 10) {
      profile.lastActivities = profile.lastActivities.slice(-10);
    }
    
    // Ruh halini güncelle
    if (analysis.emotion !== 'neutral') {
      profile.currentMood = analysis.emotion;
    }
    
    await profile.save();
  }

  // Yedek yanıt
  static getFallbackResponse(message) {
    const fallbacks = [
      'Sen harika bir çocuksun! Her gün daha iyi oluyorsun. 🌟',
      'Küçük adımlarla büyük başarılar elde ederiz! 💪',
      'Seninle gurur duyuyorum! Devam et! 🎉',
      'Her zorluk seni daha güçlü yapar! ⭐',
      'Sen bir kahramansın! Her şeyi başarabilirsin! 🦸‍♂️'
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Çocuk profili getir
  static async getChildProfile(childId) {
    return await KisiselYanit.findOne({ childId });
  }

  // Profil güncelle
  static async updateChildProfile(childId, updates) {
    return await KisiselYanit.findOneAndUpdate(
      { childId },
      { ...updates, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
  }

  // Tüm profilleri getir
  static async getAllProfiles() {
    return await KisiselYanit.find({ isActive: true });
  }

  // Profil sil
  static async deleteProfile(childId) {
    return await KisiselYanit.findOneAndUpdate(
      { childId },
      { isActive: false },
      { new: true }
    );
  }

  // Mesaj analizi
  static analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    return {
      topic: this.detectTopic(lowerMessage),
      emotion: this.detectEmotion(lowerMessage),
      urgency: this.detectUrgency(lowerMessage),
      complexity: this.detectComplexity(lowerMessage),
      keywords: this.extractKeywords(lowerMessage)
    };
  }

  // Konu tespiti (çocuk ve veli için)
  static detectTopic(message) {
    const topics = {
      // Çocuk konuları
      'test': ['test', 'soru', 'sınav', 'çöz', 'doğru', 'yanlış'],
      'reading': ['kitap', 'okuma', 'hikaye', 'sayfa', 'kitapçık'],
      'gaming': ['oyun', 'oyna', 'eğlence', 'oyuncak', 'oyuncu'],
      'homework': ['ödev', 'ev ödevi', 'çalışma', 'ders'],
      'school': ['okul', 'sınıf', 'öğretmen', 'arkadaş', 'ders'],
      'motivation': ['motivasyon', 'enerji', 'güç', 'başarı', 'hedef'],
      'frustration': ['zor', 'yapamıyorum', 'bıktım', 'sıkıldım', 'zorluk'],
      'achievement': ['başardım', 'kazandım', 'güzel', 'harika', 'süper'],
      'social': ['arkadaş', 'sosyal', 'paylaş', 'birlikte', 'grup'],
      'creative': ['çizim', 'resim', 'sanat', 'yaratıcı', 'hayal'],
      
      // Veli konuları
      'discipline': ['disiplin', 'kural', 'sınır', 'ceza', 'tutarlılık', 'düzen'],
      'education': ['eğitim', 'okul', 'ders', 'başarı', 'not', 'sınav'],
      'behavior': ['davranış', 'tutum', 'alışkanlık', 'problem', 'sorun'],
      'stress': ['stres', 'yorgun', 'bıktım', 'zor', 'problem', 'endişe'],
      'screen_time': ['ekran', 'telefon', 'tablet', 'bilgisayar', 'internet'],
      'nutrition': ['yemek', 'beslenme', 'sağlık', 'vitamin', 'dengeli'],
      'sleep': ['uyku', 'uyumuyor', 'gece', 'uyku düzeni', 'yatma'],
      'social_development': ['arkadaş', 'sosyal', 'iletişim', 'paylaşım'],
      'emotional_support': ['duygu', 'anlayış', 'destek', 'güven', 'sevgi'],
      'time_management': ['zaman', 'planlama', 'program', 'organizasyon']
    };
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  // Duygu tespiti (çocuk ve veli için)
  static detectEmotion(message) {
    const emotions = {
      'happy': ['mutlu', 'güzel', 'harika', 'süper', 'eğlenceli', 'güldüm', 'sevinçli'],
      'sad': ['üzgün', 'kötü', 'ağladım', 'sad', 'mutsuz', 'kırgın', 'hüzünlü'],
      'angry': ['kızgın', 'sinirli', 'öfke', 'kızdım', 'sinirlendim', 'öfkeli'],
      'tired': ['yorgun', 'bıktım', 'yoruldum', 'uykum var', 'dinlenmek', 'bitkin'],
      'excited': ['heyecanlı', 'enerjik', 'coşkulu', 'hevesli', 'istekli', 'coşkulu'],
      'frustrated': ['zor', 'yapamıyorum', 'bıktım', 'sıkıldım', 'zorluk', 'sinirli'],
      'bored': ['sıkıldım', 'sıkıcı', 'boring', 'canım sıkıldı', 'monoton'],
      'confident': ['güvenli', 'yapabilirim', 'başaracağım', 'eminim', 'güvenli'],
      'anxious': ['endişeli', 'korkuyorum', 'kaygılı', 'stresli', 'gergin', 'panik'],
      'overwhelmed': ['bunaldım', 'çok fazla', 'başa çıkamıyorum', 'yetersiz'],
      'grateful': ['teşekkür', 'minnettar', 'mutlu', 'şanslı', 'blessed'],
      'hopeful': ['umutlu', 'gelecek', 'iyi olacak', 'güzel günler', 'optimist']
    };
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'neutral';
  }

  // Aciliyet tespiti
  static detectUrgency(message) {
    const urgentWords = ['acil', 'hemen', 'şimdi', 'lütfen', 'yardım', 'problem', 'kritik', 'önemli'];
    const urgentCount = urgentWords.filter(word => message.includes(word)).length;
    
    if (urgentCount >= 2) return 'high';
    if (urgentCount >= 1) return 'medium';
    return 'low';
  }

  // Karmaşıklık tespiti
  static detectComplexity(message) {
    const wordCount = message.split(' ').length;
    const hasComplexWords = /[a-zA-Z]{8,}/.test(message);
    
    if (wordCount > 15 || hasComplexWords) return 'high';
    if (wordCount > 8) return 'medium';
    return 'low';
  }

  // Anahtar kelimeler çıkar
  static extractKeywords(message) {
    const commonWords = ['ben', 'sen', 'bu', 'şu', 've', 'ile', 'için', 'gibi', 'kadar', 'bir', 'da', 'de'];
    const words = message.split(' ').filter(word => 
      word.length > 2 && !commonWords.includes(word)
    );
    
    return words.slice(0, 5); // İlk 5 anahtar kelime
  }
}

export default KisiselYanitService; 