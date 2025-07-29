// COZKAZAN KALICI AYARLAR
// Bu dosya sistem ayarlarını kalıcı olarak saklar

export const PERMANENT_SETTINGS = {
  // Test Filtreleme Ayarları
  TEST_FILTERING: {
    USE_HAVUZ_ID_ONLY: true,           // Sadece havuz ID ile filtreleme
    DISABLE_OLD_ENDPOINT: true,        // Eski endpoint'i devre dışı bırak
    AUTO_CLEANUP_INTERVAL: 30 * 60 * 1000, // 30 dakikada bir temizlik
    VALIDATE_TEST_CLASSIFICATION: true // Test sınıflandırma doğrulaması
  },
  
  // Havuz Yönetimi
  HAVUZ_MANAGEMENT: {
    AUTO_CREATE_HAVUZ: true,           // Otomatik havuz oluştur
    PREVENT_DUPLICATE_HAVUZ: true,     // Duplicate havuz oluşturmayı engelle
    CLEAN_WRONG_TESTS: true,           // Yanlış testleri otomatik temizle
    REMOVE_FROM_ALL_HAVUZ: true       // Test silindiğinde tüm havuzlardan çıkar
  },
  
  // API Güvenlik
  API_SECURITY: {
    VALIDATE_INPUTS: true,             // Giriş verilerini doğrula
    SANITIZE_QUERIES: true,            // Sorguları temizle
    LOG_ALL_REQUESTS: true,            // Tüm istekleri logla
    ERROR_HANDLING: true               // Hata yönetimi aktif
  },
  
  // Veritabanı Ayarları
  DATABASE: {
    CONNECTION_STRING: 'mongodb://localhost:27017/cozkazan',
    AUTO_RECONNECT: true,
    BUFFER_COMMANDS: true,
    MAX_POOL_SIZE: 10
  },
  
  // Sunucu Ayarları
  SERVER: {
    PORT: 3000,
    CORS_ENABLED: true,
    STATIC_FILES: true,
    COMPRESSION: false
  }
};

// Ayarları kontrol et
export function validateSettings() {
  const required = [
    'TEST_FILTERING.USE_HAVUZ_ID_ONLY',
    'HAVUZ_MANAGEMENT.AUTO_CREATE_HAVUZ',
    'API_SECURITY.VALIDATE_INPUTS'
  ];
  
  for (const setting of required) {
    const value = getNestedValue(PERMANENT_SETTINGS, setting);
    if (value === undefined) {
      throw new Error(`Gerekli ayar eksik: ${setting}`);
    }
  }
  
  console.log('✅ Kalıcı ayarlar doğrulandı');
}

// Nested object değer alma
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Ayarları dışa aktar
export default PERMANENT_SETTINGS; 