import mongoose from 'mongoose';

const hikayeSchema = new mongoose.Schema({
    baslik: {
        type: String,
        required: true,
        trim: true
    },
    konu: {
        type: String,
        required: true,
        trim: true
    },
    seviye: {
        type: String,
        enum: ['Kolay', 'Orta', 'Zor'],
        default: 'Orta'
    },
    sinif: {
        type: String,
        enum: ['sinif1', 'sinif2', 'sinif3', 'sinif4'],
        required: true
    },
    icerik: {
        type: String,
        default: ''
    },
    dosyaYolu: {
        type: String,
        default: ''
    },
    dosyaTipi: {
        type: String,
        enum: ['excel', 'pdf', 'word', 'manuel'],
        default: 'manuel'
    },
    aktif: {
        type: Boolean,
        default: true
    },
    okunmaSayisi: {
        type: Number,
        default: 0
    },
    olusturmaTarihi: {
        type: Date,
        default: Date.now
    },
    guncellemeTarihi: {
        type: Date,
        default: Date.now
    }
});

// Güncelleme tarihini otomatik güncelle
hikayeSchema.pre('save', function(next) {
    this.guncellemeTarihi = Date.now();
    next();
});

export default mongoose.model('Hikaye', hikayeSchema); 