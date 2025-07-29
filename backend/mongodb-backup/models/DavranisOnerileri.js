import mongoose from 'mongoose';

const davranisOnerileriSchema = new mongoose.Schema({
    davranis_turu: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    oneriler: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 3 && v.length <= 10; // En az 3, en fazla 10 öneri
            },
            message: 'Öneriler 3-10 arası olmalıdır'
        }
    },
    kategori: {
        type: String,
        required: true,
        enum: ['sosyal', 'duygusal', 'akademik', 'fiziksel', 'yaratici', 'sorumluluk', 'iletişim', 'genel'],
        default: 'genel'
    },
    yas_grubu: {
        type: String,
        required: true,
        enum: ['3-5', '6-8', '9-11', '12-14', 'genel'],
        default: 'genel'
    },
    zorluk_seviyesi: {
        type: String,
        required: true,
        enum: ['kolay', 'orta', 'zor'],
        default: 'orta'
    },
    aktif: {
        type: Boolean,
        default: true
    },
    kullanım_sayisi: {
        type: Number,
        default: 0
    },
    son_guncelleme: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Davranış türüne göre arama için index
davranisOnerileriSchema.index({ davranis_turu: 'text' });

// Kategori ve yaş grubuna göre arama için index
davranisOnerileriSchema.index({ kategori: 1, yas_grubu: 1 });

const DavranisOnerileri = mongoose.model('DavranisOnerileri', davranisOnerileriSchema);

export default DavranisOnerileri; 