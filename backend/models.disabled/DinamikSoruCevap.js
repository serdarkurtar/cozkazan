import mongoose from 'mongoose';

const dinamikSoruCevapSchema = new mongoose.Schema({
    soru: {
        type: String,
        required: true,
        trim: true
    },
    cevap: {
        type: String,
        required: true,
        trim: true
    },
    kategori: {
        type: String,
        required: true,
        enum: ['education', 'psychology', 'health', 'motivation', 'behavior', 'social', 'emotional', 'academic', 'creative', 'general'],
        default: 'general'
    },
    zorluk_seviyesi: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    yas_grubu: {
        type: String,
        required: true,
        enum: ['3-5', '6-8', '9-11', '12-14', 'genel'],
        default: 'genel'
    },
    soru_tipi: {
        type: String,
        required: true,
        enum: ['genel', 'senaryo', 'problem', 'reflection', 'advice', 'explanation', 'motivation'],
        default: 'genel'
    },
    anahtar_kelimeler: {
        type: [String],
        default: []
    },
    kullanım_sayisi: {
        type: Number,
        default: 0
    },
    kalite_puani: {
        type: Number,
        default: 5,
        min: 1,
        max: 10
    },
    aktif: {
        type: Boolean,
        default: true
    },
    uretim_tarihi: {
        type: Date,
        default: Date.now
    },
    son_guncelleme: {
        type: Date,
        default: Date.now
    },
    uretim_kaynagi: {
        type: String,
        enum: ['ai_generated', 'template_based', 'pattern_based', 'hybrid'],
        default: 'ai_generated'
    },
    varyasyon_id: {
        type: String,
        default: null
    },
    orijinal_soru_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DinamikSoruCevap',
        default: null
    }
}, {
    timestamps: true
});

// Arama için indexler
dinamikSoruCevapSchema.index({ soru: 'text', cevap: 'text' });
dinamikSoruCevapSchema.index({ kategori: 1, zorluk_seviyesi: 1, yas_grubu: 1 });
dinamikSoruCevapSchema.index({ anahtar_kelimeler: 1 });
dinamikSoruCevapSchema.index({ kalite_puani: -1, kullanım_sayisi: -1 });

// Sanal alan: Toplam puan
dinamikSoruCevapSchema.virtual('toplam_puan').get(function() {
    return (this.kalite_puani * 0.7) + (Math.min(this.kullanım_sayisi / 10, 3) * 0.3);
});

const DinamikSoruCevap = mongoose.model('DinamikSoruCevap', dinamikSoruCevapSchema);

export default DinamikSoruCevap; 