import TestHavuzu from '../models/TestHavuzu.js';
import Konu from '../models/Konu.js';

/**
 * Konu için varsayılan havuz oluştur veya getir
 */
export async function getOrCreateVarsayilanHavuz(sinifId, dersId, konuId) {
    try {
        // Önce konuyu bul
        const konu = await Konu.findById(konuId);
        if (!konu) {
            throw new Error('Konu bulunamadı');
        }

        // Varsayılan havuz ID'si varsa, o havuzu getir
        if (konu.varsayilanHavuzId) {
            const havuz = await TestHavuzu.findById(konu.varsayilanHavuzId);
            if (havuz) {
                console.log(`[HAVUZ] Varsayılan havuz bulundu: ${havuz._id}`);
                return havuz;
            }
        }

        // Varsayılan havuz yoksa, yeni oluştur
        const yeniHavuz = new TestHavuzu({
            sinif: sinifId,
            ders: dersId,
            konu: konuId,
            testler: [],
            havuzAdi: `${konu.ad} - Ana Havuz`,
            havuzTipi: 'varsayilan'
        });

        await yeniHavuz.save();

        // Konuyu güncelle
        konu.varsayilanHavuzId = yeniHavuz._id;
        await konu.save();

        console.log(`[HAVUZ] Yeni varsayılan havuz oluşturuldu: ${yeniHavuz._id}`);
        return yeniHavuz;

    } catch (error) {
        console.error('[HAVUZ] Varsayılan havuz oluşturma hatası:', error);
        throw error;
    }
}

/**
 * Testi otomatik olarak uygun havuza ekle
 */
export async function testiHavuzaEkle(testId, sinifId, dersId, konuId) {
    try {
        // Varsayılan havuzu al
        const havuz = await getOrCreateVarsayilanHavuz(sinifId, dersId, konuId);
        
        // Test zaten havuzda var mı kontrol et
        if (havuz.testler.includes(testId)) {
            console.log(`[HAVUZ] Test zaten havuzda: ${testId}`);
            return havuz;
        }

        // Testi havuza ekle
        havuz.testler.push(testId);
        await havuz.save();

        console.log(`[HAVUZ] Test havuza eklendi: ${testId} -> ${havuz._id}`);
        return havuz;

    } catch (error) {
        console.error('[HAVUZ] Test ekleme hatası:', error);
        throw error;
    }
}

/**
 * Yeni havuz oluştur (test yetersiz kaldığında)
 */
export async function yeniHavuzOlustur(sinifId, dersId, konuId, havuzAdi = null) {
    try {
        const konu = await Konu.findById(konuId);
        if (!konu) {
            throw new Error('Konu bulunamadı');
        }

        // Havuz sayısını artır
        konu.havuzSayisi += 1;
        await konu.save();

        // Yeni havuz oluştur
        const yeniHavuz = new TestHavuzu({
            sinif: sinifId,
            ders: dersId,
            konu: konuId,
            testler: [],
            havuzAdi: havuzAdi || `${konu.ad} - Havuz ${konu.havuzSayisi}`,
            havuzTipi: 'ek'
        });

        await yeniHavuz.save();

        console.log(`[HAVUZ] Yeni havuz oluşturuldu: ${yeniHavuz._id} (${havuzAdi})`);
        return yeniHavuz;

    } catch (error) {
        console.error('[HAVUZ] Yeni havuz oluşturma hatası:', error);
        throw error;
    }
}

/**
 * Konunun tüm havuzlarını getir
 */
export async function konuHavuzlariniGetir(sinifId, dersId, konuId) {
    try {
        const havuzlar = await TestHavuzu.find({
            sinif: sinifId,
            ders: dersId,
            konu: konuId
        }).populate('sinif ders konu').sort('olusturmaTarihi');

        console.log(`[HAVUZ] ${havuzlar.length} havuz bulundu`);
        return havuzlar;

    } catch (error) {
        console.error('[HAVUZ] Havuz listesi getirme hatası:', error);
        throw error;
    }
}

/**
 * Havuzdan rastgele testler getir (tüm havuzları birleştirerek)
 */
export async function rastgeleTestlerGetir(sinifId, dersId, konuId, limit = 10) {
    try {
        // Tüm havuzları getir
        const havuzlar = await TestHavuzu.find({
            sinif: sinifId,
            ders: dersId,
            konu: konuId,
            aktif: true
        }).populate({
            path: 'testler',
            match: { aktif: true },
            populate: {
                path: 'sorular',
                model: 'Soru',
                limit: 5
            }
        });

        if (havuzlar.length === 0) {
            return { havuzBos: true, message: 'Bu konu için aktif havuz bulunamadı.' };
        }

        // Tüm testleri birleştir
        let tumTestler = [];
        havuzlar.forEach(havuz => {
            if (havuz.testler && havuz.testler.length > 0) {
                tumTestler = tumTestler.concat(havuz.testler);
            }
        });

        if (tumTestler.length === 0) {
            return { havuzBos: true, message: 'Bu konu için aktif test bulunamadı.' };
        }

        // Rastgele testler seç
        const rastgeleTestler = tumTestler
            .sort(() => 0.5 - Math.random())
            .slice(0, parseInt(limit));

        console.log(`[HAVUZ] ${rastgeleTestler.length} rastgele test gönderildi (${tumTestler.length} toplam)`);
        
        return {
            havuz: {
                sinif: havuzlar[0].sinif,
                ders: havuzlar[0].ders,
                konu: havuzlar[0].konu,
                toplamTest: tumTestler.length,
                havuzSayisi: havuzlar.length
            },
            testler: rastgeleTestler
        };

    } catch (error) {
        console.error('[HAVUZ] Rastgele test getirme hatası:', error);
        throw error;
    }
} 