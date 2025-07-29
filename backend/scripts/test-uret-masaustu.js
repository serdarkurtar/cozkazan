const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

console.log('🚀 Test üretim scripti başlatılıyor...');

try {
    // Masaüstü yolunu al
    const desktopPath = path.join(require('os').homedir(), 'Desktop');
    const testFolderPath = path.join(desktopPath, 'Testler');
    
    console.log('📁 Masaüstü yolu:', desktopPath);
    console.log('📁 Test klasörü yolu:', testFolderPath);

    // Test klasörünü oluştur
    if (!fs.existsSync(testFolderPath)) {
        fs.mkdirSync(testFolderPath, { recursive: true });
        console.log('✅ Test klasörü oluşturuldu');
    } else {
        console.log('✅ Test klasörü zaten mevcut');
    }

    // 1. Sınıf Türkçe - Güzel Davranışlarımız Testi
    const turkce1GuzelDavranislar = [
        {
            soru: "Aşağıdakilerden hangisi güzel bir davranıştır?",
            secenekler: ["Arkadaşlarımızla kavga etmek", "Büyüklerimize saygı göstermek", "Çevreyi kirletmek", "Yalan söylemek"],
            dogruCevap: "B"
        },
        {
            soru: "Sınıfta öğretmenimiz konuşurken ne yapmalıyız?",
            secenekler: ["Konuşmaya devam etmek", "Dikkatle dinlemek", "Pencereye bakmak", "Defterle oynamak"],
            dogruCevap: "B"
        },
        {
            soru: "Arkadaşımız hasta olduğunda ne yapmalıyız?",
            secenekler: ["Onunla dalga geçmek", "Geçmiş olsun demek", "Uzak durmak", "Haber vermemek"],
            dogruCevap: "B"
        },
        {
            soru: "Okul bahçesinde oyun oynarken ne yapmalıyız?",
            secenekler: ["Diğer çocukları itmek", "Sırayla oynamak", "Çöpleri yere atmak", "Gürültü yapmak"],
            dogruCevap: "B"
        },
        {
            soru: "Yemek yerken hangi davranış doğrudur?",
            secenekler: ["Ağzımız açık çiğnemek", "Çatal bıçak kullanmak", "Konuşarak yemek", "Hızlı yemek"],
            dogruCevap: "B"
        }
    ];

    // Excel dosyası oluştur
    function createTestFile(sinif, ders, konu, sorular) {
        console.log(`📝 ${konu} testi oluşturuluyor...`);
        
        const workbook = XLSX.utils.book_new();
        
        // Soruları Excel formatına çevir
        const excelData = sorular.map((soru, index) => ({
            'Soru No': index + 1,
            'Soru': soru.soru,
            'A)': soru.secenekler[0],
            'B)': soru.secenekler[1],
            'C)': soru.secenekler[2],
            'D)': soru.secenekler[3],
            'Doğru Cevap': soru.dogruCevap
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sorular');
        
        // Dosya yolunu oluştur
        const sinifPath = path.join(testFolderPath, sinif);
        const dersPath = path.join(sinifPath, ders);
        
        if (!fs.existsSync(sinifPath)) {
            fs.mkdirSync(sinifPath, { recursive: true });
        }
        if (!fs.existsSync(dersPath)) {
            fs.mkdirSync(dersPath, { recursive: true });
        }
        
        const fileName = `${konu}-5-Test.xlsx`;
        const filePath = path.join(dersPath, fileName);
        
        // Dosyayı kaydet
        XLSX.writeFile(workbook, filePath);
        console.log(`✅ ${fileName} oluşturuldu: ${filePath}`);
    }

    // İlk test dosyasını oluştur
    createTestFile('1. Sınıf', 'Türkçe', 'Güzel Davranışlarımız', turkce1GuzelDavranislar);

    console.log(`\n📁 Test dosyaları masaüstünde oluşturuldu: ${testFolderPath}`);
    console.log('🎯 Şimdi bu dosyaları admin panelinden yükleyebilirsiniz!');

} catch (error) {
    console.error('❌ Hata oluştu:', error.message);
    console.error('Stack trace:', error.stack);
} 