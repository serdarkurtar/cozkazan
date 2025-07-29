import DinamikSoruCevap from '../models/DinamikSoruCevap.js';

class DinamikQAService {
    constructor() {
        this.soruSablonlari = {
            education: [
                "Çocuğum {konu} konusunda zorlanıyor, nasıl yardım edebilirim?",
                "{yas} yaşındaki çocuğum {konu} öğrenirken nasıl destek olabilirim?",
                "Çocuğumun {konu} becerisini geliştirmek için ne yapabilirim?",
                "{konu} konusunda çocuğumun motivasyonunu nasıl artırabilirim?",
                "Çocuğum {konu} ile ilgili sorular soruyor, nasıl cevap vermeliyim?"
            ],
            psychology: [
                "Çocuğum {durum} yaşıyor, nasıl destek olabilirim?",
                "{yas} yaşındaki çocuğum {davranis} sergiliyor, normal mi?",
                "Çocuğumun {duygu} duygusunu nasıl anlayabilirim?",
                "Çocuğum {situasyon} durumunda nasıl davranmalıyım?",
                "Çocuğumun {gelisim} gelişimini nasıl destekleyebilirim?"
            ],
            health: [
                "Çocuğumun {saglik} sağlığı için ne yapabilirim?",
                "{yas} yaşındaki çocuğumun {beslenme} beslenmesi nasıl olmalı?",
                "Çocuğumun {uyku} uyku düzeni için önerileriniz neler?",
                "Çocuğum {aktivite} aktivitesi yaparken nelere dikkat etmeliyim?",
                "Çocuğumun {hastalik} hastalığında nasıl davranmalıyım?"
            ],
            motivation: [
                "Çocuğumun {hedef} hedefine ulaşması için nasıl motive edebilirim?",
                "Çocuğum {gorev} görevini yapmak istemiyor, ne yapabilirim?",
                "Çocuğumun {basari} başarısını nasıl artırabilirim?",
                "Çocuğum {zorluk} zorluğu karşısında nasıl destek olabilirim?",
                "Çocuğumun {kendine_guven} kendine güvenini nasıl artırabilirim?"
            ],
            behavior: [
                "Çocuğum {davranis} davranışı sergiliyor, nasıl yaklaşmalıyım?",
                "Çocuğumun {sosyal} sosyal becerilerini nasıl geliştirebilirim?",
                "Çocuğum {problem} problemi yaşıyor, nasıl çözebilirim?",
                "Çocuğumun {alışkanlık} alışkanlığını nasıl değiştirebilirim?",
                "Çocuğum {durum} durumunda nasıl davranmalıyım?"
            ]
        };

        this.cevapSablonlari = {
            education: [
                "Çocuğunuzun {konu} konusunda gelişmesi için {yontem} yöntemini kullanabilirsiniz. {detay}",
                "{yas} yaşındaki çocuklar için {konu} öğrenirken {tavsiye} tavsiye edilir. {aciklama}",
                "Çocuğunuzun {konu} becerisini geliştirmek için {aktivite} aktiviteleri yapabilirsiniz. {fayda}",
                "{konu} konusunda motivasyonu artırmak için {strateji} stratejisini uygulayabilirsiniz. {sonuc}",
                "Çocuğunuzun {konu} sorularına {yaklasim} yaklaşımıyla cevap vermeniz önerilir. {neden}"
            ],
            psychology: [
                "Çocuğunuzun {durum} yaşaması normal bir gelişim sürecidir. {destek} şekilde destek olabilirsiniz. {aciklama}",
                "{yas} yaşındaki çocuklarda {davranis} davranışı {normal} görülebilir. {yaklasim} yaklaşımı önerilir. {neden}",
                "Çocuğunuzun {duygu} duygusunu anlamak için {yontem} yöntemini kullanabilirsiniz. {fayda}",
                "{situasyon} durumunda {tavsiye} tavsiye edilir. {strateji} stratejisini uygulayabilirsiniz. {sonuc}",
                "Çocuğunuzun {gelisim} gelişimini desteklemek için {aktivite} aktiviteleri yapabilirsiniz. {fayda}"
            ],
            health: [
                "Çocuğunuzun {saglik} sağlığı için {tavsiye} tavsiye edilir. {detay} şekilde uygulayabilirsiniz. {fayda}",
                "{yas} yaşındaki çocuklar için {beslenme} beslenmesi {onem} önemlidir. {oneri} önerilir. {neden}",
                "Çocuğunuzun {uyku} uyku düzeni için {rutin} rutini oluşturabilirsiniz. {fayda}",
                "{aktivite} aktivitesi sırasında {dikkat} dikkat etmeniz önemlidir. {guvenlik} güvenlik önlemleri alabilirsiniz. {neden}",
                "Çocuğunuzun {hastalik} hastalığında {yaklasim} yaklaşımı önerilir. {tedavi} tedavi yöntemleri uygulayabilirsiniz. {dikkat}"
            ],
            motivation: [
                "Çocuğunuzun {hedef} hedefine ulaşması için {strateji} stratejisini kullanabilirsiniz. {motivasyon} şekilde motive edebilirsiniz. {sonuc}",
                "Çocuğunuzun {gorev} görevini yapması için {yaklasim} yaklaşımı önerilir. {teşvik} şekilde teşvik edebilirsiniz. {fayda}",
                "Çocuğunuzun {basari} başarısını artırmak için {yontem} yöntemini uygulayabilirsiniz. {destek} şekilde destek olabilirsiniz. {sonuc}",
                "Çocuğunuzun {zorluk} zorluğu karşısında {destek} şekilde destek olabilirsiniz. {strateji} stratejisini kullanabilirsiniz. {fayda}",
                "Çocuğunuzun {kendine_guven} kendine güvenini artırmak için {yaklasim} yaklaşımı önerilir. {aktivite} aktiviteleri yapabilirsiniz. {sonuc}"
            ],
            behavior: [
                "Çocuğunuzun {davranis} davranışı karşısında {yaklasim} yaklaşımı önerilir. {strateji} stratejisini uygulayabilirsiniz. {sonuc}",
                "Çocuğunuzun {sosyal} sosyal becerilerini geliştirmek için {aktivite} aktiviteleri yapabilirsiniz. {fayda}",
                "Çocuğunuzun {problem} problemini çözmek için {yontem} yöntemini kullanabilirsiniz. {destek} şekilde destek olabilirsiniz. {sonuc}",
                "Çocuğunuzun {alışkanlık} alışkanlığını değiştirmek için {strateji} stratejisini uygulayabilirsiniz. {sabır} sabırlı olmanız önemlidir. {fayda}",
                "{durum} durumunda {tavsiye} tavsiye edilir. {yaklasim} yaklaşımı kullanabilirsiniz. {sonuc}"
            ]
        };

        this.kelimeler = {
            konu: ['matematik', 'okuma', 'yazma', 'fen', 'sosyal', 'sanat', 'müzik', 'spor', 'teknoloji', 'dil'],
            yas: ['3-5', '6-8', '9-11', '12-14'],
            durum: ['kaygı', 'stres', 'öfke', 'üzüntü', 'mutluluk', 'heyecan', 'korku', 'güven', 'gurur', 'şaşkınlık'],
            davranis: ['agresif', 'çekingen', 'sosyal', 'meraklı', 'inatçı', 'uyumlu', 'yaratıcı', 'düzenli', 'enerjik', 'sakin'],
            duygu: ['mutluluk', 'üzüntü', 'öfke', 'korku', 'şaşkınlık', 'gurur', 'utanç', 'kaygı', 'heyecan', 'güven'],
            situasyon: ['okul', 'ev', 'oyun', 'sosyal ortam', 'aile', 'arkadaş', 'öğretmen', 'yabancı', 'yeni ortam', 'değişiklik'],
            gelisim: ['fiziksel', 'zihinsel', 'sosyal', 'duygusal', 'dil', 'motor', 'bilişsel', 'yaratıcı', 'problem çözme', 'iletişim'],
            saglik: ['fiziksel', 'zihinsel', 'duygusal', 'sosyal', 'beslenme', 'uyku', 'egzersiz', 'hijyen', 'güvenlik', 'bağışıklık'],
            beslenme: ['kahvaltı', 'öğle yemeği', 'akşam yemeği', 'ara öğün', 'su', 'vitamin', 'protein', 'karbonhidrat', 'yağ', 'mineral'],
            uyku: ['düzenli', 'kaliteli', 'yeterli', 'erken', 'geç', 'derin', 'hafif', 'kesintisiz', 'rahat', 'sağlıklı'],
            aktivite: ['oyun', 'spor', 'sanat', 'müzik', 'okuma', 'yazma', 'resim', 'dans', 'yüzme', 'koşu'],
            hastalik: ['soğuk algınlığı', 'ateş', 'öksürük', 'ishal', 'kabızlık', 'baş ağrısı', 'karın ağrısı', 'alerji', 'enfeksiyon', 'yorgunluk'],
            hedef: ['okul başarısı', 'sosyal beceri', 'spor', 'sanat', 'okuma', 'yazma', 'matematik', 'dil', 'müzik', 'teknoloji'],
            gorev: ['ödev', 'ev işi', 'okuma', 'yazma', 'temizlik', 'düzen', 'sorumluluk', 'proje', 'araştırma', 'sunum'],
            basari: ['akademik', 'sosyal', 'spor', 'sanat', 'iletişim', 'problem çözme', 'yaratıcılık', 'liderlik', 'takım çalışması', 'özgüven'],
            zorluk: ['okul', 'sosyal', 'akademik', 'duygusal', 'fiziksel', 'aile', 'arkadaş', 'öğretmen', 'yeni ortam', 'değişiklik'],
            kendine_guven: ['sosyal', 'akademik', 'fiziksel', 'yaratıcı', 'problem çözme', 'iletişim', 'liderlik', 'karar verme', 'risk alma', 'başarı'],
            alışkanlık: ['okuma', 'yazma', 'temizlik', 'düzen', 'beslenme', 'uyku', 'egzersiz', 'teknoloji', 'sosyal medya', 'oyun'],
            problem: ['akademik', 'sosyal', 'duygusal', 'davranışsal', 'iletişim', 'dikkat', 'motivasyon', 'özgüven', 'kaygı', 'öfke']
        };

        this.yontemler = {
            yontem: ['oyunlaştırma', 'görselleştirme', 'hikaye anlatımı', 'pratik yapma', 'modelleme', 'pekiştirme', 'sabır', 'anlayış', 'destek', 'rehberlik'],
            tavsiye: ['düzenli rutin', 'olumlu pekiştirme', 'sabırlı yaklaşım', 'anlayışlı tutum', 'destekleyici ortam', 'güvenli alan', 'açık iletişim', 'modelleme', 'oyunlaştırma', 'görselleştirme'],
            aktivite: ['oyun', 'resim', 'müzik', 'spor', 'okuma', 'yazma', 'sanat', 'dans', 'yüzme', 'koşu'],
            strateji: ['küçük adımlar', 'olumlu pekiştirme', 'sabırlı yaklaşım', 'anlayışlı tutum', 'destekleyici ortam', 'güvenli alan', 'açık iletişim', 'modelleme', 'oyunlaştırma', 'görselleştirme'],
            yaklasim: ['sabırlı', 'anlayışlı', 'destekleyici', 'güvenli', 'açık', 'olumlu', 'yapıcı', 'sıcak', 'saygılı', 'empatik'],
            detay: ['adım adım', 'yavaş yavaş', 'düzenli olarak', 'sürekli', 'tutarlı şekilde', 'sabırla', 'anlayışla', 'destekle', 'güvenle', 'açık şekilde'],
            aciklama: ['Bu yaklaşım çocuğunuzun gelişimini destekler.', 'Bu yöntem uzun vadede olumlu sonuçlar verir.', 'Bu strateji çocuğunuzun özgüvenini artırır.', 'Bu aktivite çocuğunuzun becerilerini geliştirir.', 'Bu tavsiye çocuğunuzun motivasyonunu artırır.'],
            normal: ['çok', 'bazen', 'genellikle', 'sık sık', 'ara sıra', 'nadiren', 'her zaman', 'hiç', 'çoğunlukla', 'bazı durumlarda'],
            fayda: ['Bu yaklaşım çocuğunuzun gelişimini destekler.', 'Bu yöntem uzun vadede olumlu sonuçlar verir.', 'Bu strateji çocuğunuzun özgüvenini artırır.', 'Bu aktivite çocuğunuzun becerilerini geliştirir.', 'Bu tavsiye çocuğunuzun motivasyonunu artırır.'],
            onem: ['çok', 'son derece', 'oldukça', 'fazla', 'yeterince', 'biraz', 'az', 'çok az', 'hiç', 'tamamen'],
            oneri: ['düzenli rutin', 'sağlıklı beslenme', 'yeterli uyku', 'düzenli egzersiz', 'temizlik', 'güvenlik', 'sosyal aktivite', 'eğlenceli oyun', 'yaratıcı aktivite', 'açık hava'],
            neden: ['Bu yaklaşım çocuğunuzun gelişimini destekler.', 'Bu yöntem uzun vadede olumlu sonuçlar verir.', 'Bu strateji çocuğunuzun özgüvenini artırır.', 'Bu aktivite çocuğunuzun becerilerini geliştirir.', 'Bu tavsiye çocuğunuzun motivasyonunu artırır.'],
            rutin: ['düzenli', 'sabit', 'tutarlı', 'güvenli', 'rahat', 'sakin', 'huzurlu', 'mutlu', 'enerjik', 'sağlıklı'],
            dikkat: ['güvenlik', 'sağlık', 'hijyen', 'temizlik', 'düzen', 'sabır', 'anlayış', 'destek', 'rehberlik', 'gözetim'],
            guvenlik: ['temel', 'gerekli', 'önemli', 'kritik', 'vital', 'esas', 'ana', 'merkezi', 'temel', 'gerekli'],
            tedavi: ['tıbbi', 'doğal', 'alternatif', 'geleneksel', 'modern', 'bilimsel', 'güvenli', 'etkili', 'hızlı', 'yavaş'],
            motivasyon: ['olumlu pekiştirme', 'ödül sistemi', 'başarı kutlaması', 'destekleyici sözler', 'güven verici yaklaşım', 'sabırlı rehberlik', 'anlayışlı tutum', 'sıcak iletişim', 'oyunlaştırma', 'görselleştirme'],
            teşvik: ['olumlu pekiştirme', 'ödül sistemi', 'başarı kutlaması', 'destekleyici sözler', 'güven verici yaklaşım', 'sabırlı rehberlik', 'anlayışlı tutum', 'sıcak iletişim', 'oyunlaştırma', 'görselleştirme'],
            destek: ['sabırlı', 'anlayışlı', 'güvenli', 'sıcak', 'olumlu', 'yapıcı', 'destekleyici', 'rehberlik eden', 'motivasyon veren', 'cesaretlendiren'],
            sonuc: ['Bu yaklaşım çocuğunuzun gelişimini destekler.', 'Bu yöntem uzun vadede olumlu sonuçlar verir.', 'Bu strateji çocuğunuzun özgüvenini artırır.', 'Bu aktivite çocuğunuzun becerilerini geliştirir.', 'Bu tavsiye çocuğunuzun motivasyonunu artırır.'],
            sabır: ['çok', 'yeterince', 'biraz', 'az', 'çok az', 'hiç', 'tamamen', 'oldukça', 'fazla', 'son derece']
        };
    }

    // Rastgele kelime seç
    rastgeleKelime(kategori) {
        const kelimeler = this.kelimeler[kategori] || [];
        return kelimeler[Math.floor(Math.random() * kelimeler.length)];
    }

    // Rastgele yöntem seç
    rastgeleYontem(kategori) {
        const yontemler = this.yontemler[kategori] || [];
        return yontemler[Math.floor(Math.random() * yontemler.length)];
    }

    // Sablonu doldur
    sablonDoldur(sablon, kategori) {
        let sonuc = sablon;
        
        // Kelime değiştiricileri
        const kelimeRegex = /\{(\w+)\}/g;
        sonuc = sonuc.replace(kelimeRegex, (match, kelime) => {
            return this.rastgeleKelime(kelime) || match;
        });

        // Yöntem değiştiricileri
        const yontemRegex = /\{(\w+)\}/g;
        sonuc = sonuc.replace(yontemRegex, (match, yontem) => {
            return this.rastgeleYontem(yontem) || match;
        });

        return sonuc;
    }

    // Tek soru-cevap üret
    async tekSoruCevapUret(kategori, zorlukSeviyesi, yasGrubu) {
        const soruSablonlari = this.soruSablonlari[kategori] || this.soruSablonlari.general;
        const cevapSablonlari = this.cevapSablonlari[kategori] || this.cevapSablonlari.general;

        const rastgeleSoruSablonu = soruSablonlari[Math.floor(Math.random() * soruSablonlari.length)];
        const rastgeleCevapSablonu = cevapSablonlari[Math.floor(Math.random() * cevapSablonlari.length)];

        const soru = this.sablonDoldur(rastgeleSoruSablonu, kategori);
        const cevap = this.sablonDoldur(rastgeleCevapSablonu, kategori);

        // Anahtar kelimeleri çıkar
        const anahtarKelimeler = this.anahtarKelimeleriCikar(soru, cevap);

        return {
            soru,
            cevap,
            kategori,
            zorluk_seviyesi: zorlukSeviyesi,
            yas_grubu: yasGrubu,
            anahtar_kelimeler: anahtarKelimeler,
            soru_tipi: this.soruTipiniBelirle(kategori),
            uretim_kaynagi: 'template_based'
        };
    }

    // Anahtar kelimeleri çıkar
    anahtarKelimeleriCikar(soru, cevap) {
        const kelimeler = [...soru.split(' '), ...cevap.split(' ')]
            .map(kelime => kelime.toLowerCase().replace(/[.,!?]/g, ''))
            .filter(kelime => kelime.length > 3)
            .filter(kelime => !['çocuğum', 'çocuğunuzun', 'nasıl', 'ne', 'hangi', 'nerede', 'ne zaman', 'neden', 'kim', 'nereye'].includes(kelime));

        // En sık geçen kelimeleri al
        const kelimeSayisi = {};
        kelimeler.forEach(kelime => {
            kelimeSayisi[kelime] = (kelimeSayisi[kelime] || 0) + 1;
        });

        return Object.keys(kelimeSayisi)
            .sort((a, b) => kelimeSayisi[b] - kelimeSayisi[a])
            .slice(0, 5);
    }

    // Soru tipini belirle
    soruTipiniBelirle(kategori) {
        const tipMap = {
            education: 'explanation',
            psychology: 'reflection',
            health: 'advice',
            motivation: 'motivation',
            behavior: 'advice'
        };
        return tipMap[kategori] || 'genel';
    }

    // Toplu soru-cevap üret
    async topluSoruCevapUret(options = {}) {
        const {
            difficulty_levels = ['easy', 'medium', 'hard'],
            categories = ['education', 'psychology', 'health', 'motivation', 'behavior'],
            max_per_category = 1000,
            yas_grubu = 'genel'
        } = options;

        const sonuclar = [];
        let toplamUretilen = 0;

        for (const kategori of categories) {
            console.log(`📝 ${kategori} kategorisi için soru-cevap üretiliyor...`);
            
            for (const zorluk of difficulty_levels) {
                const kategoriBasina = Math.ceil(max_per_category / (categories.length * difficulty_levels.length));
                let uretilen = 0;

                while (uretilen < kategoriBasina && toplamUretilen < max_per_category) {
                    try {
                        const soruCevap = await this.tekSoruCevapUret(kategori, zorluk, yas_grubu);
                        
                        // Veritabanına kaydet
                        const yeniSoruCevap = new DinamikSoruCevap(soruCevap);
                        await yeniSoruCevap.save();
                        
                        sonuclar.push(soruCevap);
                        uretilen++;
                        toplamUretilen++;

                        if (uretilen % 100 === 0) {
                            console.log(`   ✅ ${kategori} (${zorluk}): ${uretilen}/${kategoriBasina} üretildi`);
                        }
                    } catch (error) {
                        console.error(`❌ Soru-cevap üretme hatası:`, error.message);
                    }
                }
            }
        }

        return {
            toplam_uretilen: toplamUretilen,
            kategoriler: categories,
            zorluk_seviyeleri: difficulty_levels,
            sonuclar: sonuclar
        };
    }

    // Varyasyon üret
    async varyasyonUret(orijinalId, varyasyonSayisi = 5) {
        const orijinal = await DinamikSoruCevap.findById(orijinalId);
        if (!orijinal) {
            throw new Error('Orijinal soru-cevap bulunamadı');
        }

        const varyasyonlar = [];
        for (let i = 0; i < varyasyonSayisi; i++) {
            const varyasyon = await this.tekSoruCevapUret(
                orijinal.kategori,
                orijinal.zorluk_seviyesi,
                orijinal.yas_grubu
            );

            varyasyon.varyasyon_id = `var_${orijinalId}_${i + 1}`;
            varyasyon.orijinal_soru_id = orijinalId;
            varyasyon.uretim_kaynagi = 'pattern_based';

            const yeniVaryasyon = new DinamikSoruCevap(varyasyon);
            await yeniVaryasyon.save();
            varyasyonlar.push(varyasyon);
        }

        return varyasyonlar;
    }

    // Kalite kontrolü
    async kaliteKontrol(soruCevapId) {
        const soruCevap = await DinamikSoruCevap.findById(soruCevapId);
        if (!soruCevap) {
            throw new Error('Soru-cevap bulunamadı');
        }

        let kalitePuani = 5; // Başlangıç puanı

        // Uzunluk kontrolü
        if (soruCevap.soru.length > 20 && soruCevap.soru.length < 200) kalitePuani += 1;
        if (soruCevap.cevap.length > 50 && soruCevap.cevap.length < 500) kalitePuani += 1;

        // Anahtar kelime kontrolü
        if (soruCevap.anahtar_kelimeler.length >= 3) kalitePuani += 1;

        // Kullanım kontrolü
        if (soruCevap.kullanım_sayisi > 0) kalitePuani += 1;

        // Güncelleme
        soruCevap.kalite_puani = Math.min(kalitePuani, 10);
        await soruCevap.save();

        return soruCevap.kalite_puani;
    }

    // İstatistikler
    async istatistikler() {
        const toplam = await DinamikSoruCevap.countDocuments();
        const kategoriler = await DinamikSoruCevap.aggregate([
            { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);

        const zorlukSeviyeleri = await DinamikSoruCevap.aggregate([
            { $group: { _id: '$zorluk_seviyesi', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);

        const yasGruplari = await DinamikSoruCevap.aggregate([
            { $group: { _id: '$yas_grubu', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);

        const ortalamaKalite = await DinamikSoruCevap.aggregate([
            { $group: { _id: null, ortalama: { $avg: '$kalite_puani' } } }
        ]);

        return {
            toplam,
            kategoriler,
            zorluk_seviyeleri: zorlukSeviyeleri,
            yas_gruplari: yasGruplari,
            ortalama_kalite: ortalamaKalite[0]?.ortalama || 0
        };
    }
}

export default DinamikQAService; 