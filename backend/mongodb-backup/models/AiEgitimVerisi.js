import mongoose from 'mongoose';

const aiEgitimVerisiSchema = new mongoose.Schema({
    kategori: {
        type: String,
        required: true,
        enum: ['genel', 'matematik', 'türkçe', 'fen', 'sosyal', 'hayat', 'din', 'sanat', 'spor', 'teknoloji', 'veli', 'çocuk', 'veli-çocuk']
    },
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
    aciklama: {
        type: String,
        trim: true
    },
    zorlukSeviyesi: {
        type: String,
        enum: ['kolay', 'orta', 'zor'],
        default: 'orta'
    },
    yasGrubu: {
        type: String,
        enum: ['6-8', '9-11', '12-14'],
        default: '9-11'
    },
    etiketler: [{
        type: String,
        trim: true
    }],
    kullanimSayisi: {
        type: Number,
        default: 0
    },
    basariOrani: {
        type: Number,
        default: 0
    },
    aktif: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Güncelleme zamanını otomatik ayarla
aiEgitimVerisiSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// İndeksler
aiEgitimVerisiSchema.index({ kategori: 1, aktif: 1 });
aiEgitimVerisiSchema.index({ etiketler: 1 });
aiEgitimVerisiSchema.index({ zorlukSeviyesi: 1, yasGrubu: 1 });

const AiEgitimVerisi = mongoose.model('AiEgitimVerisi', aiEgitimVerisiSchema);

export default AiEgitimVerisi; 