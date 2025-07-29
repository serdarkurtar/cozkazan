import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DavranisOnerileri from '../models/DavranisOnerileri.js';

dotenv.config();

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cozkazan';

// Verdiğin davranış önerileri
const davranisOnerileri = [
    {
        "davranis_turu": "Sabırlı davrandı",
        "oneriler": [
            "Çocuğunuzun sabrını takdir etmek gelişimi destekler.",
            "Sabır, uzun vadede başarı getirir; ona fırsat tanıyın.",
            "Sabırlı davranışlarını modelleyerek artırabilirsiniz.",
            "Sabırlı kalması için pozitif pekiştirme yapın.",
            "Bu davranış, duygusal zekasının güçlendiğinin işaretidir."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Empati gösterdi",
        "oneriler": [
            "Empati yeteneği sosyal ilişkilerde çok değerlidir.",
            "Empatik davranışlarını gördüğünüzde onu övün.",
            "Empatiyi desteklemek için örnek olun ve sohbet edin.",
            "Empati, duygusal gelişimin önemli parçasıdır.",
            "Arkadaşlarıyla empati kurması olumlu bir adımdır."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Öfkesini kontrol etti",
        "oneriler": [
            "Öfkesini kontrol etmeyi öğrenmesi harika.",
            "Nefes egzersizleriyle öfkesini yönetmesine destek olun.",
            "Olumsuz duyguları ifade etmek normaldir, anlayış gösterin.",
            "Sabırlı yaklaşım öfke yönetiminde çok işe yarar.",
            "Öfkesini ifade ederken ona güven verin ve destek olun."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Yardım istedi",
        "oneriler": [
            "Yardım istemesi özgüven gelişiminin işaretidir.",
            "İhtiyaç duyduğunda destek almak iyi bir davranıştır.",
            "Yardım istediğinde onu cesaretlendirin.",
            "Başkalarına güven duyması sosyal becerilerini artırır.",
            "Yardım isterken kendini ifade etmesi önemlidir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Duygularını ifade etti",
        "oneriler": [
            "Duygularını ifade etmesi iletişimi güçlendirir.",
            "Açık duygusal ifade özgüveni artırır.",
            "Duygularını anlatırken onu dinleyin ve destekleyin.",
            "Duygularını paylaşması aranızdaki bağı kuvvetlendirir.",
            "Onun duygu ifade biçimine saygı gösterin ve anlayışlı olun."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Arkadaşlarıyla iyi anlaştı",
        "oneriler": [
            "Sosyal ilişkilerini desteklemek çok önemli.",
            "Arkadaşlarıyla iyi ilişkiler kurması olumlu bir gelişimdir.",
            "Oyun sırasında arkadaşlarına saygı göstermesi takdire şayandır.",
            "Sosyal becerileri oyunla güçlendirin.",
            "Arkadaşlık ilişkilerini güçlendirmek için fırsatlar yaratın."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Yeni bir şey öğrendi",
        "oneriler": [
            "Öğrenmeye açık olması gelişimi destekler.",
            "Yeni bilgilerle ilgilenmesini teşvik edin.",
            "Merak duygusunu canlı tutmaya devam edin.",
            "Başarılarını kutlayarak motivasyonunu artırın.",
            "Öğrenirken sabırlı ve meraklı olması güzel bir özellik."
        ],
        "kategori": "akademik",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Sorumluluk aldı",
        "oneriler": [
            "Sorumluluk alması özgüven gelişimidir.",
            "Küçük sorumluluklar vererek destek olun.",
            "Başarılarını takdir etmek motivasyonunu artırır.",
            "Sorumluluk duygusunu pekiştirmek için rehberlik edin.",
            "Sorumluluk almayı oyunlarla eğlenceli hale getirin."
        ],
        "kategori": "sorumluluk",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Paylaşımda bulundu",
        "oneriler": [
            "Paylaşmak sosyal becerilerin temelidir.",
            "Paylaşımda bulunduğunda onu övün.",
            "Paylaşmayı teşvik eden aktiviteler planlayın.",
            "Paylaşmanın mutluluk verdiğini anlatın.",
            "Paylaşım davranışı empatiyi güçlendirir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Kendi kararını verdi",
        "oneriler": [
            "Karar verme becerisi gelişimini destekleyin.",
            "Kendi kararlarını almasına fırsat tanıyın.",
            "Karar verirken yanında olun ve rehberlik edin.",
            "Başarılarını kutlayarak özgüvenini artırın.",
            "Küçük kararlarla başlayarak sorumluluk verin."
        ],
        "kategori": "sorumluluk",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Dikkatini topladı",
        "oneriler": [
            "Dikkatini toplaması öğrenmeyi kolaylaştırır.",
            "Dikkatini sürdürmesi için çevresini düzenleyin.",
            "Dikkat oyunlarıyla pratik yapmasını sağlayın.",
            "Dikkatini kaybettiğinde nazikçe yönlendirin.",
            "Odaklanma becerisi zamanla gelişir, sabırlı olun."
        ],
        "kategori": "akademik",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Sorun çözdü",
        "oneriler": [
            "Sorun çözme yeteneği gelişiyor.",
            "Kendi çözümlerini bulmasına fırsat verin.",
            "Başarılarını kutlayarak motivasyonunu artırın.",
            "Sorun çözme becerisi özgüveni güçlendirir.",
            "Yaratıcı düşünmesini teşvik edin."
        ],
        "kategori": "yaratici",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Krizle başa çıktı",
        "oneriler": [
            "Kriz anlarında sakin kalması önemli.",
            "Zor anlarda destekleyici olun.",
            "Kriz yönetimi becerilerini oyunla geliştirin.",
            "Güven duygusunu artıracak yaklaşımlar uygulayın.",
            "Krizleri fırsat olarak görmesini öğretin."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Kendini ifade etti",
        "oneriler": [
            "Kendini ifade etme becerisi özgüveni artırır.",
            "Duygularını anlatmasına fırsat tanıyın.",
            "Açık iletişim kurması olumlu bir gelişmedir.",
            "Kendini ifade etmesini destekleyen ortamlar yaratın.",
            "Kendini ifade etme yolunda cesaretlendirin."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Sosyal kurallara uydu",
        "oneriler": [
            "Sosyal kurallara uyması önemlidir.",
            "Kuralları öğrenmesini destekleyin.",
            "Sosyal kuralları oyunlarla öğretebilirsiniz.",
            "Kurallara uyduğunda onu takdir edin.",
            "Kurallara saygı, toplumsal gelişimin temelidir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Olumlu iletişim kurdu",
        "oneriler": [
            "Olumlu iletişim becerisi gelişiyor.",
            "İletişimde nazik ve saygılı olmasını teşvik edin.",
            "Olumlu iletişim davranışlarını pekiştirin.",
            "Dinlemeyi öğretmek iletişimi güçlendirir.",
            "Olumlu iletişim aile bağlarını kuvvetlendirir."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Sabırlı bekledi",
        "oneriler": [
            "Sabırlı olmak önemli bir sosyal beceridir.",
            "Sabırlı davranışlarını destekleyin.",
            "Sabırlı beklemek gelişim sürecinin parçasıdır.",
            "Sabır için pozitif pekiştirme kullanın.",
            "Sabırlı olmayı oyunlarla öğretin."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Olumlu davranış sergiledi",
        "oneriler": [
            "Olumlu davranışlar takdir edilmeli.",
            "Olumlu davranışları modelleyin.",
            "Olumlu davranışları pekiştirmek için fırsatlar yaratın.",
            "Olumlu davranışlar sosyal uyumu artırır.",
            "Olumlu davranışlar özgüveni destekler."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Yardım etti",
        "oneriler": [
            "Yardım etmek sosyal sorumluluktur.",
            "Yardım ettiği zamanlarda onu övün.",
            "Yardım etmeyi teşvik eden oyunlar oynayın.",
            "Yardım etmek empatiyi güçlendirir.",
            "Yardım eden çocuk mutlu olur ve özgüveni artar."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Dinledi ve anladı",
        "oneriler": [
            "İyi bir dinleyici olması iletişimi güçlendirir.",
            "Dinleme becerilerini geliştirmek için fırsatlar yaratın.",
            "Dinlediğini anlaması sosyal becerileri artırır.",
            "Dinlemeyi modelleyerek öğretin.",
            "Dinleyerek öğrenme süreci gelişir."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Takdir edildi",
        "oneriler": [
            "Takdir edilmek özgüveni artırır.",
            "Olumlu geri bildirim motivasyonu güçlendirir.",
            "Takdir edilen çocuk daha çok çaba gösterir.",
            "Başarılarını kutlamak önemli bir motivasyondur.",
            "Takdir kültürü aile bağlarını güçlendirir."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Yeni deneyimler yaşadı",
        "oneriler": [
            "Yeni deneyimler öğrenmeyi hızlandırır.",
            "Farklı durumlarda destekleyici olun.",
            "Yeni deneyimler özgüveni artırır.",
            "Deneyimlerini paylaşması gelişimini destekler.",
            "Yeni deneyimlere açık olması gelişim için iyidir."
        ],
        "kategori": "genel",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Duygusal destek istedi",
        "oneriler": [
            "Duygusal destek ihtiyacını anlamak önemlidir.",
            "Onu dinlemek ve desteklemek güven verir.",
            "Duygusal ihtiyaçları karşılamak gelişimi destekler.",
            "Destekleyici aile ortamı çok değerlidir.",
            "Duygusal destek çocuğun kendini iyi hissetmesini sağlar."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Hata yaptı ve öğrendi",
        "oneriler": [
            "Hatalardan öğrenmek gelişimin anahtarıdır.",
            "Hatalarını kabul etmesi olumlu bir davranıştır.",
            "Hataları destekleyici şekilde ele alın.",
            "Deneyimlerden öğrenmesi için fırsat tanıyın.",
            "Hatalarını paylaşması özgüvenini artırır."
        ],
        "kategori": "akademik",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Kurallara uydu",
        "oneriler": [
            "Kurallara uyma disiplini öğretir.",
            "Kuralların önemini açıklayın.",
            "Kurallara uyduğu için onu ödüllendirin.",
            "Kuralların ailede uygulanması önemlidir.",
            "Kurallara uyma olumlu davranışları artırır."
        ],
        "kategori": "sorumluluk",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Motivasyonu yüksek",
        "oneriler": [
            "Motivasyonu yüksek tutmak için destek olun.",
            "Başarılarını kutlayarak motive edin.",
            "Motivasyon düşüklüğünü gözlemleyin.",
            "Hedefler koyup destek verin.",
            "Motivasyon arttıkça başarı gelir."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Güven duydu",
        "oneriler": [
            "Güven duygusu gelişimi destekler.",
            "Güvenli ortamlar yaratmaya özen gösterin.",
            "Güven duyduğu kişilerle daha rahat olur.",
            "Güven eksikliğini fark edip destek olun.",
            "Güven gelişimi sosyal ilişkileri güçlendirir."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Oyun oynarken işbirliği yaptı",
        "oneriler": [
            "İşbirliği becerisi sosyal gelişim için önemli.",
            "Oyunlarda işbirliğini teşvik edin.",
            "İşbirliği yapması olumlu sosyal beceridir.",
            "Takım çalışmalarını destekleyin.",
            "İşbirliği oyunlarla eğlenceli hale gelir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Duygularını paylaştı",
        "oneriler": [
            "Duygularını paylaşması aranızdaki bağı güçlendirir.",
            "Paylaşmayı teşvik edin ve model olun.",
            "Duygularını ifade etmesine fırsat verin.",
            "Paylaşmak sosyal becerileri artırır.",
            "Duygularını paylaşması özgüveni destekler."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Kendini kontrol etti",
        "oneriler": [
            "Kendini kontrol edebilmek olgunluk göstergesidir.",
            "Kontrol becerilerini oyunlarla destekleyin.",
            "Kendini kontrol ettiği anlarda onu destekleyin.",
            "Duygusal kontrol gelişimini teşvik edin.",
            "Kendini kontrol etmesi sosyal uyumu artırır."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Kendine güvendi",
        "oneriler": [
            "Kendine güveni artırmak için destek olun.",
            "Başarılarını kutlayarak özgüvenini güçlendirin.",
            "Kendine güvenen çocuk daha cesurdur.",
            "Kendine güven geliştirmek için fırsatlar sunun.",
            "Özgüven gelişimi için olumlu pekiştirme şarttır."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "İyi dinledi",
        "oneriler": [
            "İyi dinlemek etkili iletişimin temelidir.",
            "Dinleme becerilerini oyunla destekleyin.",
            "Dinlerken saygılı olması takdir edilir.",
            "İyi dinleyen çocuk sosyal becerilerini güçlendirir.",
            "Dinleme alışkanlığı gelişimi için fırsat yaratın."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Yardımseverlik gösterdi",
        "oneriler": [
            "Yardımseverlik empatiyi geliştirir.",
            "Yardım ettiğinde onu övün ve destekleyin.",
            "Yardım etmeyi teşvik eden etkinlikler yapın.",
            "Yardımseverlik sosyal ilişkileri güçlendirir.",
            "Yardımsever davranış özgüveni artırır."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "kolay"
    },
    {
        "davranis_turu": "Hata yapmaktan korkmadı",
        "oneriler": [
            "Hata yapmaktan korkmaması gelişim için önemli.",
            "Hatalarını öğrenme fırsatı olarak görün.",
            "Hata yapınca cesaretlendirin ve destek olun.",
            "Hatalardan ders çıkarması olumlu bir beceridir.",
            "Hata yapmaktan korkmaması özgüvenini artırır."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Kendini ifade etti",
        "oneriler": [
            "Kendini ifade etme özgüven gerektirir.",
            "İfade yeteneğini destekleyin ve teşvik edin.",
            "Kendini doğru ifade etmesi sosyal gelişimdir.",
            "Kendini ifade ettiği anlarda onu dinleyin.",
            "Kendini ifade etme pratiği önemlidir."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Sorunları paylaştı",
        "oneriler": [
            "Sorunlarını paylaşması iletişimi güçlendirir.",
            "Sorunları konuşması çözüm sürecini hızlandırır.",
            "Sorunları paylaştığında destek olun.",
            "Sorun paylaşımı güven duygusunu artırır.",
            "Sorunları paylaşmak sosyal beceriler için faydalıdır."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Olumlu geri bildirim verdi",
        "oneriler": [
            "Olumlu geri bildirim iletişimi geliştirir.",
            "Geri bildirim verirken nazik olun.",
            "Olumlu geri bildirim sosyal becerileri artırır.",
            "Geri bildirim verme alışkanlığı kazandırın.",
            "Olumlu geri bildirim iletişimde güven sağlar."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Yaratıcı çözümler buldu",
        "oneriler": [
            "Yaratıcı düşünme gelişimi destekler.",
            "Çözümlerini paylaşmasını teşvik edin.",
            "Yaratıcılığı oyunlarla artırabilirsiniz.",
            "Yaratıcı çözümler özgüveni güçlendirir.",
            "Yaratıcı düşünmeye fırsat tanıyın."
        ],
        "kategori": "yaratici",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Duygusal destek aradı",
        "oneriler": [
            "Duygusal destek ihtiyacını fark edin ve yanında olun.",
            "Destekleyici yaklaşım güven sağlar.",
            "Duygusal destek gelişimi hızlandırır.",
            "Duygularını ifade ederken yanında olun.",
            "Duygusal destek çocuğun kendini iyi hissetmesini sağlar."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Kendini motive etti",
        "oneriler": [
            "Kendi kendini motive etmesi çok önemli.",
            "Motivasyonunu artıracak hedefler koyun.",
            "Başarılarını kutlayarak motive edin.",
            "Motivasyonunu düşük gördüğünüzde destek olun.",
            "Motivasyon gelişimi için teşvik edici olun."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Grup içinde uyum sağladı",
        "oneriler": [
            "Grup uyumu sosyal gelişimi destekler.",
            "Uyumlu davranışlarını övün ve teşvik edin.",
            "Grup aktiviteleriyle uyumu artırabilirsiniz.",
            "Uyum becerisi güven duygusunu güçlendirir.",
            "Uyumlu davranış sosyal ilişkiler için çok önemlidir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Görüşlerini paylaştı",
        "oneriler": [
            "Görüşlerini açıkça ifade etmek olumlu.",
            "Fikirlerini paylaşmasını destekleyin.",
            "Görüşlerini dinleyip takdir edin.",
            "Fikir paylaşımı özgüveni artırır.",
            "Görüşlerini paylaşırken sabırlı olun."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Olumlu tutum sergiledi",
        "oneriler": [
            "Olumlu tutum başarıyı artırır.",
            "Tutumunu modelleyerek pekiştirin.",
            "Olumlu tutumu destekleyen ortamlar yaratın.",
            "Tutum değişimi için sabırlı olun.",
            "Olumlu tutum sosyal gelişimi destekler."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Arkadaşlarına saygılı davrandı",
        "oneriler": [
            "Saygı sosyal ilişkilerin temelidir.",
            "Saygılı davranışları övün ve destekleyin.",
            "Saygı kuralları oyunlarla öğretilebilir.",
            "Saygı geliştirilmesi özgüveni artırır.",
            "Saygılı davranışlar empatiyi güçlendirir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Duygularını kontrol etti",
        "oneriler": [
            "Duygu kontrolü olgunluğun işaretidir.",
            "Kontrol becerilerini oyunla destekleyin.",
            "Duygularını kontrol ettiği anlarda onu takdir edin.",
            "Duygusal regülasyon için rehberlik edin.",
            "Duygularını kontrol etmesi sosyal uyumu artırır."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Sabırlı bekledi",
        "oneriler": [
            "Sabır sosyal becerilerin temelidir.",
            "Sabırlı davranışlarını pekiştirin.",
            "Sabırlı beklemek gelişim için önemlidir.",
            "Sabır için pozitif pekiştirme kullanın.",
            "Sabırlı olmayı oyunlarla öğretin."
        ],
        "kategori": "duygusal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Olumlu iletişim kurdu",
        "oneriler": [
            "Olumlu iletişim ilişkileri güçlendirir.",
            "Nazik ve saygılı iletişimi teşvik edin.",
            "Olumlu iletişimi modelleyin ve pekiştirin.",
            "Dinlemeyi öğretmek iletişimi güçlendirir.",
            "Olumlu iletişim aile bağlarını kuvvetlendirir."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Duygularını paylaştı",
        "oneriler": [
            "Duygularını paylaşması bağı güçlendirir.",
            "Paylaşmayı teşvik edin ve model olun.",
            "Duygularını ifade etmesine fırsat verin.",
            "Paylaşmak sosyal becerileri artırır.",
            "Duygularını paylaşması özgüveni destekler."
        ],
        "kategori": "iletişim",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    },
    {
        "davranis_turu": "Kendini savundu",
        "oneriler": [
            "Kendini savunması özgüven gelişimini gösterir.",
            "Savunma becerilerini nazikçe öğretin.",
            "Kendini ifade etme becerisini destekleyin.",
            "Savunma sırasında saygılı davranmayı öğretin.",
            "Kendini savunması sosyal becerileri güçlendirir."
        ],
        "kategori": "sosyal",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "zor"
    },
    {
        "davranis_turu": "Yeni şeylere açık oldu",
        "oneriler": [
            "Yeni deneyimlere açık olması gelişimi hızlandırır.",
            "Merakını destekleyin ve yeni fırsatlar sunun.",
            "Yeni şeylere cesaretle yaklaşmasını teşvik edin.",
            "Deneyimlerini paylaşmasını destekleyin.",
            "Yeni deneyimler özgüvenini artırır."
        ],
        "kategori": "genel",
        "yas_grubu": "genel",
        "zorluk_seviyesi": "orta"
    }
];

async function davranisOnerileriYukle() {
    try {
        console.log('🔗 MongoDB bağlantısı kuruluyor...');
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB bağlantısı başarılı!');

        console.log('💾 Davranış önerileri yükleniyor...');
        let basarili = 0;
        let hatali = 0;

        for (const davranis of davranisOnerileri) {
            try {
                const yeniDavranis = new DavranisOnerileri(davranis);
                await yeniDavranis.save();
                basarili++;
                console.log(`✅ ${davranis.davranis_turu} eklendi`);
            } catch (error) {
                hatali++;
                console.error(`❌ ${davranis.davranis_turu} hatası:`, error.message);
            }
        }

        console.log('\n🎉 Davranış önerileri yükleme tamamlandı!');
        console.log(`✅ Başarılı: ${basarili}`);
        console.log(`❌ Hatalı: ${hatali}`);
        console.log(`📊 Toplam: ${basarili + hatali}`);

        // İstatistikler
        const toplam = await DavranisOnerileri.countDocuments();
        const kategoriIstatistikleri = await DavranisOnerileri.aggregate([
            { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);

        console.log('\n📈 İstatistikler:');
        console.log(`📊 Toplam davranış türü: ${toplam}`);
        console.log('🏷️ Kategori dağılımı:');
        kategoriIstatistikleri.forEach(kat => {
            console.log(`   ${kat._id}: ${kat.sayi}`);
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB bağlantısı kapatıldı');
    }
}

// Scripti çalıştır
davranisOnerileriYukle(); 