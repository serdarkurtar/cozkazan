class Hikaye {
  final String id;
  final String baslik;
  final String kategori;
  final String icerik;
  final int seviye;
  final int xpOdul;
  final bool sesliOkumaDestegi;
  final List<String> kelimeler;

  Hikaye({
    required this.id,
    required this.baslik,
    required this.kategori,
    required this.icerik,
    required this.seviye,
    required this.xpOdul,
    this.sesliOkumaDestegi = true,
    required this.kelimeler,
  });

  // JSON'dan Hikaye oluştur
  factory Hikaye.fromJson(Map<String, dynamic> json) {
    return Hikaye(
      id: json['_id'] ?? json['id'] ?? '',
      baslik: json['baslik'] ?? '',
      kategori: json['kategori'] ?? '',
      icerik: json['icerik'] ?? '',
      seviye: json['seviye'] ?? 1,
      xpOdul: json['xpOdul'] ?? 0,
      sesliOkumaDestegi: json['sesliOkumaDestegi'] ?? true,
      kelimeler: List<String>.from(json['kelimeler'] ?? []),
    );
  }

  // Hikaye'yi JSON'a çevir
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'baslik': baslik,
      'kategori': kategori,
      'icerik': icerik,
      'seviye': seviye,
      'xpOdul': xpOdul,
      'sesliOkumaDestegi': sesliOkumaDestegi,
      'kelimeler': kelimeler,
    };
  }
}

class HikayeVerileri {
  static List<Hikaye> tumHikayeler = [
    Hikaye(
      id: '1',
      baslik: 'Kırmızı Başlıklı Kız',
      kategori: 'Masallar',
      seviye: 1,
      xpOdul: 50,
      sesliOkumaDestegi: true,
      kelimeler: [
        'kırmızı', 'başlık', 'kız', 'büyükanne', 'orman', 'kurt', 'ev', 'yol', 'çiçek',
        'kuş', 'ağaç', 'güneş', 'gölge', 'ses', 'korku', 'yardım', 'avcı', 'kurtulmak',
        'mutlu', 'son', 'öğrenmek', 'dikkat', 'tehlike', 'güvenlik', 'aile', 'sevmek'
      ],
      icerik: '''
Bir varmış bir yokmuş, küçük bir köyde kırmızı başlıklı bir kız yaşarmış. Bu kızın çok sevdiği bir büyükannesi varmış. Bir gün annesi kırmızı başlıklı kıza:

"Büyükannen hasta olmuş. Ona bu sepet dolusu yiyecek götürür müsün?" demiş.

Kırmızı başlıklı kız çok sevinmiş ve hemen yola çıkmış. Annesi ona:

"Yolda kimseyle konuşma ve doğrudan büyükannenin evine git" demiş.

Kırmızı başlıklı kız ormana girmiş. Ormanda çiçekler açmış, kuşlar şarkı söylüyormuş. Kız çiçekleri toplamaya başlamış. O sırada kötü kurt gelmiş ve kıza:

"Merhaba küçük kız, nereye gidiyorsun?" demiş.

Kırmızı başlıklı kız kurdun ne kadar kötü olduğunu bilmiyormuş ve ona:

"Büyükannemin evine gidiyorum. Ona yiyecek götürüyorum" demiş.

Kurt kısa yoldan büyükannenin evine gitmiş. Büyükannesi kapıyı açınca kurt onu yutmuş. Sonra büyükannenin kıyafetlerini giymiş ve yatağına yatmış.

Kırmızı başlıklı kız geldiğinde kapıyı çalmış. Kurt:

"Kim o?" demiş.

"Ben kırmızı başlıklı kızım" demiş kız.

"Gel içeri" demiş kurt.

Kız içeri girmiş ve büyükannesinin çok değiştiğini görmüş. Ama kurdun olduğunu anlamamış.

"Büyükanne, kulakların ne kadar büyük!" demiş.

"Seni daha iyi duyabilmek için" demiş kurt.

"Büyükanne, gözlerin ne kadar büyük!" demiş.

"Seni daha iyi görebilmek için" demiş kurt.

"Büyükanne, ağzın ne kadar büyük!" demiş.

"Seni daha iyi yiyebilmek için!" demiş kurt ve kırmızı başlıklı kızı yutmuş.

O sırada bir avcı geçiyormuş. Büyükannenin evinden sesler duymuş. İçeri girmiş ve kurdun karnının şiş olduğunu görmüş. Avcı bıçağını çıkarmış ve kurdun karnını kesmiş. Kırmızı başlıklı kız ve büyükanne kurtulmuş.

Avcı kurdun karnına taş doldurmuş. Kurt uyandığında çok ağır olduğu için hareket edememiş ve düşüp ölmüş.

Kırmızı başlıklı kız bir daha hiç kimseyle konuşmamış ve her zaman annesinin sözünü dinlemiş. Büyükannesi de iyileşmiş ve hepsi mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: Yabancılarla konuşmamalı ve büyüklerimizin sözünü dinlemeliyiz.
      ''',
    ),
    
    Hikaye(
      id: '2',
      baslik: 'Üç Küçük Domuz',
      kategori: 'Hayvan Hikayeleri',
      seviye: 2,
      xpOdul: 75,
      sesliOkumaDestegi: true,
      kelimeler: [
        'domuz', 'kardeş', 'ev', 'yapmak', 'saman', 'odun', 'tuğla', 'kurt', 'üflemek',
        'yıkmak', 'kaçmak', 'güvenli', 'çalışmak', 'tembel', 'akıllı', 'güçlü', 'dayanıklı',
        'öğrenmek', 'dikkat', 'tehlike', 'yardım', 'mutlu', 'son', 'aile', 'birlik'
      ],
      icerik: '''
Bir varmış bir yokmuş, üç küçük domuz kardeş varmış. Büyüdüklerinde ev yapmaya karar vermişler. En küçük domuz çok tembelmiş ve hemen evini yapmak istemiş.

En küçük domuz samanlardan bir ev yapmış. Çok hızlı bitirmiş ve hemen oyun oynamaya gitmiş. Ortanca domuz biraz daha çalışkanmış. Odunlardan bir ev yapmış. Biraz daha zaman almış ama yine de hızlı bitirmiş.

En büyük domuz çok akıllıymış. Tuğlalardan sağlam bir ev yapmaya karar vermiş. Çok çalışmış, çok zaman harcamış ama çok güzel ve güvenli bir ev yapmış.

Bir gün kötü kurt gelmiş. Önce en küçük domuzun saman evine gitmiş. Kapıyı çalmış:

"Küçük domuz, küçük domuz, beni içeri al!" demiş.

"Hayır, hayır, saçımın teliyle, saçımın teliyle, seni içeri almam!" demiş küçük domuz.

"O zaman evini üfleyip yıkacağım!" demiş kurt.

Kurt çok güçlü üflemiş ve saman ev yıkılmış. Küçük domuz korkmuş ve ortanca domuzun odun evine kaçmış.

Kurt ortanca domuzun evine gitmiş:

"Küçük domuzlar, küçük domuzlar, beni içeri alın!" demiş.

"Hayır, hayır, saçımızın teliyle, saçımızın teliyle, seni içeri almayız!" demişler.

"O zaman evinizi üfleyip yıkacağım!" demiş kurt.

Kurt çok güçlü üflemiş ve odun ev de yıkılmış. İki küçük domuz korkmuş ve büyük domuzun tuğla evine kaçmışlar.

Kurt büyük domuzun evine gitmiş:

"Küçük domuzlar, küçük domuzlar, beni içeri alın!" demiş.

"Hayır, hayır, saçımızın teliyle, saçımızın teliyle, seni içeri almayız!" demişler.

"O zaman evinizi üfleyip yıkacağım!" demiş kurt.

Kurt çok güçlü üflemiş ama tuğla ev yıkılmamış. Tekrar üflemiş, yine yıkılmamış. Üçüncü kez üflemiş ama ev çok sağlammış, yıkılmamış.

Kurt çok sinirlenmiş. Bacadan girmeye çalışmış ama domuzlar şöminede ateş yakmışlar. Kurt bacadan düşünce ateşe düşmüş ve kuyruğu yanmış. Çok acı çekmiş ve kaçmış.

Üç küçük domuz çok mutlu olmuşlar. Büyük domuz kardeşlerine:

"Gördünüz mü? Çalışmak ve sabırlı olmak önemli. Sağlam bir ev yapmak zaman alır ama güvenlidir" demiş.

Küçük domuzlar özür dilemişler ve bir daha tembellik yapmamaya söz vermişler. Hepsi birlikte mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: Çalışmak ve sabırlı olmak önemlidir. Kolay yoldan yapılan işler güvenli olmayabilir.
      ''',
    ),

    Hikaye(
      id: '3',
      baslik: 'Küçük Balık',
      kategori: 'Hayvanlar',
      seviye: 1,
      xpOdul: 5,
      sesliOkumaDestegi: true,
      kelimeler: ['balık', 'deniz', 'anne', 'mutlu'],
      icerik: '''
Bir gün küçük bir balık denizde yüzüyordu. Annesini arıyordu. Sonunda annesini buldu ve çok mutlu oldu.
''',
    ),
    
    // 4. Hikaye - Pamuk Prenses
    Hikaye(
      id: '4',
      baslik: 'Pamuk Prenses ve Yedi Cüceler',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 80,
      sesliOkumaDestegi: true,
      kelimeler: [
        'prenses', 'cüce', 'orman', 'ev', 'elma', 'zehir', 'uyku', 'prens', 'öpücük',
        'uyanmak', 'güzel', 'kötü', 'kraliçe', 'ayna', 'en güzel', 'kaçmak', 'saklanmak',
        'yardım', 'arkadaş', 'mutlu', 'son', 'aşk', 'sevgi', 'iyilik', 'kötülük'
      ],
      icerik: '''
Bir varmış bir yokmuş, uzak bir ülkede güzel bir prenses yaşarmış. Adı Pamuk Prenses'miş. Annesi öldükten sonra babası yeni bir kraliçe ile evlenmiş. Bu kraliçe çok güzelmiş ama kalbi çok kötüymüş.

Kraliçenin sihirli bir aynası varmış. Her gün aynaya sorarmış:

"Ayna ayna, söyle bana, bu ülkede en güzel kim?"

Ayna her zaman:

"Sen en güzelsin kraliçe" dermiş.

Ama Pamuk Prenses büyüdükçe daha da güzelleşmiş. Bir gün kraliçe aynaya sorduğunda ayna:

"Pamuk Prenses senden daha güzel" demiş.

Kraliçe çok sinirlenmiş. Bir avcı çağırmış ve ona:

"Pamuk Prensesi ormana götür ve öldür. Kalbini bana getir" demiş.

Avcı Pamuk Prensesi ormana götürmüş ama onu öldürmeye kıyamamış. Ona:

"Kaç küçük prenses, kaç! Kraliçe seni öldürmek istiyor" demiş.

Pamuk Prenses çok korkmuş ve ormanda koşmaya başlamış. Sonunda küçük bir ev bulmuş. İçeri girmiş ve evin çok dağınık olduğunu görmüş. Yemek masasında yedi küçük tabak varmış. Prenses evi temizlemiş ve yemek yapmış.

Akşam yedi cüce eve gelmiş. Evin temizlendiğini ve yemek yapıldığını görmüşler. Çok şaşırmışlar. Sonra Pamuk Prensesi bulmuşlar. Prenses onlara hikayesini anlatmış. Cüceler ona evde kalmasına izin vermişler.

Ertesi gün cüceler madene gitmişler. Pamuk Prenses evde kalmış. O sırada yaşlı bir kadın gelmiş. Aslında bu kraliçeymiş ama kılık değiştirmiş. Pamuk Prensese zehirli bir elma vermiş. Prenses elmayı yemiş ve uykuya dalmış.

Cüceler eve geldiklerinde Pamuk Prensesi yerde yatarken bulmuşlar. Onu uyandıramamışlar. Çok üzülmüşler ama onu cam bir tabuta koymuşlar.

Bir gün güzel bir prens ormanda gezerken cam tabutu görmüş. Pamuk Prensesi çok beğenmiş. Onu öpmüş ve prenses uyanmış. Prens ona aşık olmuş ve evlenmişler.

Kraliçe ise kötülüğünün cezasını çekmiş ve ölmüş. Pamuk Prenses ve prens mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: İyilik her zaman kazanır ve güzellik sadece dış görünüşte değil, kalpte olmalıdır.
      ''',
    ),

    // 5. Hikaye - Rapunzel
    Hikaye(
      id: '5',
      baslik: 'Rapunzel',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 75,
      sesliOkumaDestegi: true,
      kelimeler: [
        'kule', 'saç', 'uzun', 'prenses', 'cadı', 'prens', 'tırmanmak', 'kaçmak',
        'görmek', 'güzel', 'ses', 'şarkı', 'aşk', 'özgürlük', 'korku', 'cesaret',
        'yardım', 'mutlu', 'son', 'umut', 'sabır', 'beklemek', 'bulmak'
      ],
      icerik: '''
Bir varmış bir yokmuş, bir kral ve kraliçenin güzel bir kızları olmuş. Adı Rapunzel'miş. Ama kötü bir cadı kızı çalmış ve yüksek bir kulede saklamış. Kule çok yüksekmiş ve sadece bir penceresi varmış.

Rapunzel çok güzelmiş ve saçları çok uzunmuş. Cadı her gün kuleye gelir ve Rapunzel'in saçlarından tırmanırmış. Rapunzel saçlarını pencereden sarkıtırmış ve cadı tırmanırmış.

Rapunzel kulede çok yalnızmış. Sadece şarkı söyleyerek vakit geçirirmiş. Bir gün güzel bir prens ormanda gezerken Rapunzel'in şarkısını duymuş. Sesi çok beğenmiş ve kuleyi bulmuş.

Prens Rapunzel'i görmüş ve ona aşık olmuş. Her gün kuleye gelir ve Rapunzel ile konuşurmuş. Rapunzel de prensi çok sevmiş. Prens ona evlenme teklifi etmiş ve Rapunzel kabul etmiş.

Rapunzel prense saçlarından tırmanmasını öğretmiş. Prens kuleye çıkmış ve Rapunzel ile kaçmaya karar vermişler. Ama cadı bunu öğrenmiş ve çok sinirlenmiş.

Cadı Rapunzel'in saçlarını kesmiş ve onu uzak bir yere götürmüş. Prens kuleye geldiğinde cadıyı bulmuş. Cadı prensi kör etmiş ve ormana atmış.

Prens çok üzülmüş ama umudunu kaybetmemiş. Yıllarca Rapunzel'i aramış. Bir gün Rapunzel'in şarkısını tekrar duymuş. Sesin geldiği yere gitmiş ve Rapunzel'i bulmuş.

Rapunzel prensi görünce çok sevinmiş. Gözyaşları prensin gözlerine değmiş ve prens tekrar görmeye başlamış. Çok mutlu olmuşlar ve evlenmişler.

Cadı ise kötülüğünün cezasını çekmiş ve bir daha görünmemiş. Rapunzel ve prens mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: Aşk ve umut her zaman kazanır. Sabırlı olmak ve umut etmek önemlidir.
      ''',
    ),

    // 6. Hikaye - Uyuyan Güzel
    Hikaye(
      id: '6',
      baslik: 'Uyuyan Güzel',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 70,
      sesliOkumaDestegi: true,
      kelimeler: [
        'prenses', 'uyku', 'iğne', 'çilek', 'prens', 'saray', 'çalı', 'diken',
        'uyanmak', 'aşk', 'güzel', 'kötü', 'peri', 'sihir', '100 yıl', 'beklemek',
        'bulmak', 'mutlu', 'son', 'sevgi', 'umut', 'sabır'
      ],
      icerik: '''
Bir varmış bir yokmuş, bir kral ve kraliçenin güzel bir kızları olmuş. Prensesin doğum gününde sarayda büyük bir kutlama yapılmış. Ülkenin tüm perileri davet edilmiş.

Periler prenses için güzel hediyeler getirmişler. Biri güzellik, biri akıl, biri müzik yeteneği vermiş. Ama kötü bir peri gelmiş ve prensesi lanetlemiş:

"Prenses on altı yaşına geldiğinde bir iğne ile parmağını delecek ve ölecek!"

İyi perilerden biri laneti hafifletmiş:

"Prenses ölmeyecek, sadece yüz yıl uyuyacak. Ve bir prens onu öperse uyanacak."

Kral çok korkmuş ve ülkedeki tüm iğneleri yasaklamış. Ama prenses büyüdükçe merak etmeye başlamış. On altı yaşına geldiğinde sarayın bir köşesinde yaşlı bir kadın bulmuş. Kadın iğne ile çilek dikiyormuş.

Prenses iğneyi görmüş ve merak etmiş. Kadından iğneyi istemiş. İğneyi alır almaz parmağını delmiş ve uykuya dalmış. Tüm saray da uykuya dalmış.

Sarayın etrafında çalılar büyümüş ve sarayı sarmış. Yıllar geçmiş. Bir gün güzel bir prens ormanda gezerken sarayı görmüş. Çalıları keserek saraya girmiş.

Prens uyuyan prensesi görmüş ve ona aşık olmuş. Onu öpmüş ve prenses uyanmış. Tüm saray da uyanmış. Prens ve prenses evlenmiş ve mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: Aşk her zaman kazanır ve iyilik kötülüğü yener.
      ''',
    ),

    // 7. Hikaye - Hansel ve Gretel
    Hikaye(
      id: '7',
      baslik: 'Hansel ve Gretel',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 65,
      sesliOkumaDestegi: true,
      kelimeler: [
        'kardeş', 'orman', 'ev', 'şeker', 'cadı', 'fırın', 'kaçmak', 'ekmek',
        'kırıntı', 'kuş', 'yemek', 'açlık', 'korku', 'cesaret', 'akıllı', 'yardım',
        'mutlu', 'son', 'aile', 'birlik', 'güvenlik', 'tehlike'
      ],
      icerik: '''
Bir varmış bir yokmuş, Hansel ve Gretel adında iki kardeş varmış. Aileleri çok fakirmiş ve yeterli yiyecekleri yokmuş. Üvey anneleri çocukları istemiyormuş.

Bir gün üvey anne kocasına:

"Çocukları ormana götür ve bırak. Artık onları besleyemeyiz" demiş.

Baba çok üzülmüş ama karısının sözünü dinlemiş. Hansel bunu duymuş ve cebine ekmek kırıntıları koymuş. Ertesi gün baba çocukları ormana götürmüş.

Hansel yolda ekmek kırıntılarını dökmüş. Baba çocukları ormanda bırakıp gitmiş. Çocuklar kırıntıları takip ederek eve dönmeye çalışmışlar ama kuşlar kırıntıları yemiş.

Çocuklar kaybolmuşlar. Aç ve yorgun bir şekilde ormanda yürürken şekerden yapılmış bir ev görmüşler. Çok sevinmişler ve evden yemeye başlamışlar.

Ama ev kötü bir cadıya aitmiş. Cadı çocukları yakalamış. Hansel'i bir kafese koymuş ve Gretel'i hizmetçi yapmış. Cadı Hansel'i yemek istiyormuş.

Cadı Gretel'e fırını ısıtmasını söylemiş. Gretel cadının Hansel'i fırına atacağını anlamış. Cadı fırını kontrol etmek için eğildiğinde Gretel onu fırına itmiş.

Çocuklar cadının evindeki hazineleri almış ve eve dönmüşler. Babaları çok sevinmiş. Üvey anne ise ölmüş. Hepsi mutlu yaşamışlar.

Bu hikayeden öğrendiğimiz ders: Akıllı olmak ve cesaretli olmak önemlidir. Kardeşler birlikte her zorluğu aşabilir.
      ''',
    ),

    // 8. Hikaye - Çizmeli Kedi
    Hikaye(
      id: '8',
      baslik: 'Çizmeli Kedi',
      kategori: 'Hayvan Hikayeleri',
      seviye: 2,
      xpOdul: 60,
      sesliOkumaDestegi: true,
      kelimeler: [
        'kedi', 'çizme', 'sahip', 'akıllı', 'dev', 'saray', 'kral', 'prenses',
        'ev', 'tarla', 'çiftçi', 'zengin', 'fakir', 'yardım', 'mutlu', 'son',
        'dostluk', 'sadakat', 'akıl', 'cesaret'
      ],
      icerik: '''
Bir varmış bir yokmuş, bir değirmenci ölmüş ve üç oğluna miras bırakmış. En büyük oğul değirmeni, ortanca oğul eşeği, en küçük oğul ise sadece bir kedi almış.

Küçük oğul çok üzülmüş. Ama kedi konuşabilirmiş ve çok akıllıymış. Kediden bir çift çizme istemiş. Çizme giyen kedi çok şık görünmüş.

Kedi sahibine:

"Bana bir çanta ver, sana yardım edeceğim" demiş.

Kedi çantaya havuç koymuş ve tavşan yakalamış. Tavşanı krala götürmüş:

"Efendim Marki'den size hediye" demiş.

Kral çok sevinmiş. Kedi her gün krala hediye götürmüş. Bir gün kral ve prensesi nehir kenarında gezerken kedi gelmiş:

"Efendim Marki nehirde yıkanıyor ama hırsızlar kıyafetlerini çalmış" demiş.

Kral oğluna güzel kıyafetler vermiş. Prenses oğlanı çok beğenmiş. Kedi devin sarayına gitmiş ve devi kandırmış:

"Sen fareye dönüşebilir misin?" demiş.

Dev fareye dönüşmüş ve kedi onu yemiş. Kedi sarayı sahibine vermiş. Oğlan prenses ile evlenmiş ve mutlu yaşamış.

Bu hikayeden öğrendiğimiz ders: Akıllı olmak ve dostluk önemlidir. Küçük şeyler bile büyük değer taşıyabilir.
      ''',
    ),

    // 9. Hikaye - Küçük Deniz Kızı
    Hikaye(
      id: '9',
      baslik: 'Küçük Deniz Kızı',
      kategori: 'Macera',
      seviye: 3,
      xpOdul: 85,
      sesliOkumaDestegi: true,
      kelimeler: [
        'deniz', 'kız', 'prens', 'ses', 'ayak', 'yüzme', 'aşk', 'sihir', 'cadı',
        'değişim', 'acı', 'mutlu', 'son', 'sevgi', 'fedakarlık', 'umut'
      ],
      icerik: '''
Denizin derinliklerinde güzel bir deniz kızı yaşarmış. Bir gün yüzeye çıkmış ve güzel bir prens görmüş. Prens ona aşık olmuş ama deniz kızı konuşamıyormuş.

Deniz kızı cadıya gitmiş ve sesini ayakları vermiş. Ama her adımda acı çekiyormuş. Prens onu sevmiş ama başka bir prenses ile evlenmiş.

Deniz kızının kız kardeşleri cadıdan bir bıçak almışlar. Deniz kızı prensi öldürürse tekrar deniz kızı olacakmış. Ama deniz kızı prensi öldürmemiş ve deniz köpüğü olmuş.

Bu hikayeden öğrendiğimiz ders: Gerçek aşk fedakarlık gerektirir.
      ''',
    ),

    // 10. Hikaye - Karagöz ile Hacivat
    Hikaye(
      id: '10',
      baslik: 'Karagöz ile Hacivat',
      kategori: 'Eğitici',
      seviye: 2,
      xpOdul: 55,
      sesliOkumaDestegi: true,
      kelimeler: [
        'arkadaş', 'oyun', 'gülmek', 'eğlence', 'komik', 'akıllı', 'cahil',
        'öğrenmek', 'mutlu', 'dostluk', 'yardım', 'anlayış'
      ],
      icerik: '''
Karagöz ve Hacivat çok iyi arkadaşlarmış. Karagöz cahil ama çok komikmiş. Hacivat ise çok bilgiliymiş. Birlikte çok eğlenirlermiş.

Karagöz her zaman Hacivat'ın sözlerini yanlış anlarmış ve bu da çok komik durumlar yaratırmış. Ama Hacivat hiç kızmazmış, sabırla açıklarmış.

Birlikte gölge oyunu oynarlarmış ve herkesi güldürürlermiş. Karagöz Hacivat'tan çok şey öğrenmiş ve Hacivat da Karagöz'ün neşesinden çok hoşlanırmış.

Bu hikayeden öğrendiğimiz ders: Dostluk ve anlayış önemlidir.
      ''',
    ),

    // 11-50. Hikayeler (Kısa versiyonlar)
    Hikaye(
      id: '11',
      baslik: 'Keloğlan ve Sihirli Tas',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 50,
      sesliOkumaDestegi: true,
      kelimeler: ['keloğlan', 'sihir', 'tas', 'akıl', 'mutlu'],
      icerik: '''Keloğlan fakir bir çocukmuş. Bir gün sihirli bir tas bulmuş. Tas ona her istediğini vermiş. Keloğlan akıllıca kullanmış ve mutlu olmuş.''',
    ),

    Hikaye(
      id: '12',
      baslik: 'Nasreddin Hoca',
      kategori: 'Eğitici',
      seviye: 2,
      xpOdul: 45,
      sesliOkumaDestegi: true,
      kelimeler: ['hoca', 'akıl', 'bilgelik', 'komik', 'öğrenmek'],
      icerik: '''Nasreddin Hoca çok akıllı bir adamdı. Her soruna komik ama akıllıca cevaplar verirdi. İnsanlara ders verirdi ama güldürerek.''',
    ),

    Hikaye(
      id: '13',
      baslik: 'Küçük Prens',
      kategori: 'Macera',
      seviye: 3,
      xpOdul: 90,
      sesliOkumaDestegi: true,
      kelimeler: ['prens', 'gezegen', 'gül', 'arkadaş', 'sevgi'],
      icerik: '''Küçük bir prens kendi gezegeninden ayrılmış. Dünyaya gelmiş ve bir gül ile arkadaş olmuş. Sevginin ne kadar önemli olduğunu öğrenmiş.''',
    ),

    Hikaye(
      id: '14',
      baslik: 'Pinokyo',
      kategori: 'Macera',
      seviye: 2,
      xpOdul: 70,
      sesliOkumaDestegi: true,
      kelimeler: ['tahta', 'çocuk', 'burun', 'yalan', 'doğru'],
      icerik: '''Pinokyo tahtadan yapılmış bir çocuktu. Yalan söylediğinde burnu uzardı. Doğru söylemeyi öğrendiğinde gerçek bir çocuk oldu.''',
    ),

    Hikaye(
      id: '15',
      baslik: 'Bremen Mızıkacıları',
      kategori: 'Hayvan Hikayeleri',
      seviye: 2,
      xpOdul: 60,
      sesliOkumaDestegi: true,
      kelimeler: ['hayvan', 'müzik', 'arkadaş', 'birlik', 'mutlu'],
      icerik: '''Bir eşek, köpek, kedi ve horoz arkadaş olmuşlar. Birlikte müzik yapmışlar ve hırsızları korkutmuşlar. Mutlu yaşamışlar.''',
    ),

    Hikaye(
      id: '16',
      baslik: 'Kırmızı Ayakkabılar',
      kategori: 'Masallar',
      seviye: 2,
      xpOdul: 55,
      sesliOkumaDestegi: true,
      kelimeler: ['ayakkabı', 'dans', 'sihir', 'öğrenmek', 'iyilik'],
      icerik: '''Bir kız çocuğu kırmızı ayakkabılar giymiş. Ayakkabılar sihirliymiş ve sürekli dans ettirmiş. Sonunda iyilik yapmayı öğrenmiş.''',
    ),

    Hikaye(
      id: '17',
      baslik: 'Küçük Çoban',
      kategori: 'Eğitici',
      seviye: 1,
      xpOdul: 40,
      sesliOkumaDestegi: true,
      kelimeler: ['çoban', 'koyun', 'kurt', 'yalan', 'doğru'],
      icerik: '''Küçük çoban sürekli "Kurt geliyor!" diye bağırırmış. Kimse inanmazmış. Gerçekten kurt geldiğinde kimse yardım etmemiş.''',
    ),

    Hikaye(
      id: '18',
      baslik: 'Altın Yumurta',
      kategori: 'Eğitici',
      seviye: 2,
      xpOdul: 50,
      sesliOkumaDestegi: true,
      kelimeler: ['tavuk', 'altın', 'yumurta', 'açgözlü', 'kaybetmek'],
      icerik: '''Bir tavuk her gün altın yumurta yumurtlarmış. Sahibi açgözlü olmuş ve tavuğu kesmiş. Hiç yumurta alamamış.''',
    ),

    Hikaye(
      id: '19',
      baslik: 'Küçük Balık',
      kategori: 'Hayvan Hikayeleri',
      seviye: 1,
      xpOdul: 35,
      sesliOkumaDestegi: true,
      kelimeler: ['balık', 'deniz', 'arkadaş', 'mutlu', 'oyun'],
      icerik: '''Küçük bir balık denizde yalnızmış. Diğer balıklarla arkadaş olmuş. Birlikte oyun oynamışlar ve mutlu olmuşlar.''',
    ),

    Hikaye(
      id: '20',
      baslik: 'Sihirli Fasulye',
      kategori: 'Macera',
      seviye: 2,
      xpOdul: 65,
      sesliOkumaDestegi: true,
      kelimeler: ['fasulye', 'dev', 'altın', 'kaçmak', 'mutlu'],
      icerik: '''Jack sihirli fasulyeler almış. Fasulyeler gökyüzüne kadar büyümüş. Dev'in evine çıkmış ve altın almış.''',
    ),

    // 21-50. Hikayeler (Kısa versiyonlar)
    Hikaye(id: '21', baslik: 'Küçük Kırmızı Tavuk', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 30, sesliOkumaDestegi: true, kelimeler: ['tavuk', 'ekmek', 'yardım', 'çalışmak'], icerik: '''Küçük kırmızı tavuk ekmek yapmak istemiş. Kimse yardım etmemiş. Kendi başına yapmış ve yemiş.'''),
    Hikaye(id: '22', baslik: 'Üç Keçi', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 35, sesliOkumaDestegi: true, kelimeler: ['keçi', 'köprü', 'trol', 'cesaret'], icerik: '''Üç keçi köprüden geçmek istemiş. Trol onları durdurmuş. En büyük keçi trolü korkutmuş.'''),
    Hikaye(id: '23', baslik: 'Küçük Kedi', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['kedi', 'süt', 'açlık', 'mutlu'], icerik: '''Küçük kedi çok açmış. Süt bulmuş ve içmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '24', baslik: 'Küçük Köpek', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['köpek', 'kemik', 'oyun', 'mutlu'], icerik: '''Küçük köpek bir kemik bulmuş. Onunla oyun oynamış. Çok mutlu olmuş.'''),
    Hikaye(id: '25', baslik: 'Küçük Kuş', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 20, sesliOkumaDestegi: true, kelimeler: ['kuş', 'uçmak', 'özgürlük', 'mutlu'], icerik: '''Küçük kuş uçmayı öğrenmiş. Gökyüzünde özgürce uçmuş. Çok mutlu olmuş.'''),
    Hikaye(id: '26', baslik: 'Küçük Tavşan', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['tavşan', 'havuç', 'yemek', 'mutlu'], icerik: '''Küçük tavşan havuç bulmuş. Yemiş ve çok mutlu olmuş.'''),
    Hikaye(id: '27', baslik: 'Küçük Sincap', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 30, sesliOkumaDestegi: true, kelimeler: ['sincap', 'fındık', 'toplamak', 'mutlu'], icerik: '''Küçük sincap fındık toplamış. Kış için saklamış. Çok mutlu olmuş.'''),
    Hikaye(id: '28', baslik: 'Küçük Ayı', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 30, sesliOkumaDestegi: true, kelimeler: ['ayı', 'bal', 'yemek', 'mutlu'], icerik: '''Küçük ayı bal bulmuş. Yemiş ve çok mutlu olmuş.'''),
    Hikaye(id: '29', baslik: 'Küçük Tilki', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['tilki', 'akıl', 'oyun', 'mutlu'], icerik: '''Küçük tilki çok akıllıymış. Diğer hayvanlarla oyun oynamış. Çok mutlu olmuş.'''),
    Hikaye(id: '30', baslik: 'Küçük Kurt', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['kurt', 'sürü', 'arkadaş', 'mutlu'], icerik: '''Küçük kurt sürüye katılmış. Arkadaş olmuş. Çok mutlu olmuş.'''),
    Hikaye(id: '31', baslik: 'Küçük Aslan', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 30, sesliOkumaDestegi: true, kelimeler: ['aslan', 'kral', 'güç', 'mutlu'], icerik: '''Küçük aslan büyümüş. Ormanın kralı olmuş. Çok mutlu olmuş.'''),
    Hikaye(id: '32', baslik: 'Küçük Fil', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['fil', 'büyük', 'güçlü', 'mutlu'], icerik: '''Küçük fil büyümüş. Çok güçlü olmuş. Çok mutlu olmuş.'''),
    Hikaye(id: '33', baslik: 'Küçük Zürafa', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['zürafa', 'boyun', 'uzun', 'mutlu'], icerik: '''Küçük zürafa büyümüş. Boynu çok uzun olmuş. Çok mutlu olmuş.'''),
    Hikaye(id: '34', baslik: 'Küçük Penguen', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['penguen', 'buz', 'yüzme', 'mutlu'], icerik: '''Küçük penguen yüzmeyi öğrenmiş. Buzda kaymış. Çok mutlu olmuş.'''),
    Hikaye(id: '35', baslik: 'Küçük Panda', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['panda', 'bambu', 'yemek', 'mutlu'], icerik: '''Küçük panda bambu yemiş. Çok lezzetliymiş. Çok mutlu olmuş.'''),
    Hikaye(id: '36', baslik: 'Küçük Koala', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['koala', 'okaliptus', 'uyku', 'mutlu'], icerik: '''Küçük koala okaliptus yemiş. Uyumuş. Çok mutlu olmuş.'''),
    Hikaye(id: '37', baslik: 'Küçük Kanguru', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['kanguru', 'zıplama', 'cebe', 'mutlu'], icerik: '''Küçük kanguru zıplamayı öğrenmiş. Cebinde yavrusu varmış. Çok mutlu olmuş.'''),
    Hikaye(id: '38', baslik: 'Küçük Timsah', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['timsah', 'nehir', 'yüzme', 'mutlu'], icerik: '''Küçük timsah nehirde yüzmüş. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '39', baslik: 'Küçük Maymun', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['maymun', 'ağaç', 'oyun', 'mutlu'], icerik: '''Küçük maymun ağaçlarda oyun oynamış. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '40', baslik: 'Küçük Zebra', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['zebra', 'çizgi', 'koşma', 'mutlu'], icerik: '''Küçük zebra koşmayı öğrenmiş. Çizgileri çok güzelmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '41', baslik: 'Küçük Gergedan', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['gergedan', 'boynuz', 'güçlü', 'mutlu'], icerik: '''Küçük gergedan büyümüş. Boynuzu çok güçlüymüş. Çok mutlu olmuş.'''),
    Hikaye(id: '42', baslik: 'Küçük Hipopotam', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['hipopotam', 'su', 'yüzme', 'mutlu'], icerik: '''Küçük hipopotam suda yüzmüş. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '43', baslik: 'Küçük Antilop', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['antilop', 'koşma', 'hızlı', 'mutlu'], icerik: '''Küçük antilop çok hızlı koşmuş. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '44', baslik: 'Küçük Geyik', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['geyik', 'boynuz', 'orman', 'mutlu'], icerik: '''Küçük geyik ormanda yaşamış. Boynuzları çok güzelmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '45', baslik: 'Küçük Domuz', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['domuz', 'çamur', 'oyun', 'mutlu'], icerik: '''Küçük domuz çamurda oyun oynamış. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '46', baslik: 'Küçük Koyun', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['koyun', 'yün', 'yumuşak', 'mutlu'], icerik: '''Küçük koyun yünü çok yumuşakmış. Çok güzelmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '47', baslik: 'Küçük İnek', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['inek', 'süt', 'çiftlik', 'mutlu'], icerik: '''Küçük inek çiftlikte yaşamış. Süt vermiş. Çok mutlu olmuş.'''),
    Hikaye(id: '48', baslik: 'Küçük At', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['at', 'koşma', 'hızlı', 'mutlu'], icerik: '''Küçük at çok hızlı koşmuş. Çok eğlenmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '49', baslik: 'Küçük Eşek', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['eşek', 'yük', 'yardım', 'mutlu'], icerik: '''Küçük eşek yük taşımış. Çok yardım etmiş. Çok mutlu olmuş.'''),
    Hikaye(id: '50', baslik: 'Küçük Horoz', kategori: 'Hayvan Hikayeleri', seviye: 1, xpOdul: 25, sesliOkumaDestegi: true, kelimeler: ['horoz', 'öten', 'sabah', 'mutlu'], icerik: '''Küçük horoz sabah ötmüş. Herkesi uyandırmış. Çok mutlu olmuş.'''),
  ];

  static List<Hikaye> kategoriyeGoreGetir(String kategori) {
    return tumHikayeler.where((hikaye) => hikaye.kategori == kategori).toList();
  }

  static List<Hikaye> seviyeyeGoreGetir(int seviye) {
    return tumHikayeler.where((hikaye) => hikaye.seviye <= seviye).toList();
  }

  static Hikaye? idIleGetir(String id) {
    try {
      return tumHikayeler.firstWhere((hikaye) => hikaye.id == id);
    } catch (e) {
      return null;
    }
  }
}

final Hikaye ornekHikaye = Hikaye(
  id: '1',
  baslik: 'Örnek Hikaye',
  icerik: 'Bu bir örnek hikaye metnidir.',
  kategori: 'Genel',
  seviye: 1,
  xpOdul: 10,
  kelimeler: [],
); 