const fs = require('fs');
const path = require('path');

// Hikaye metnini oku
const hikayeMetni = fs.readFileSync('hikaye_2500_kelime.txt', 'utf8');

// HTML template oluştur
const htmlTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Küçük Ali'nin Hayvan Dostları</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.8;
            margin: 40px;
            font-size: 16px;
            color: #333;
            background-color: #fff;
        }
        .title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 30px;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 15px;
        }
        .content {
            text-align: justify;
            text-indent: 20px;
        }
        .page-break {
            page-break-before: always;
        }
        @media print {
            body {
                margin: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="title">Küçük Ali'nin Hayvan Dostları</div>
    <div class="content">
        ${hikayeMetni.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')}
    </div>
</body>
</html>
`;

// HTML dosyasını oluştur
fs.writeFileSync('hikaye_2500_kelime.html', htmlTemplate);

console.log('✅ Hikaye HTML dosyası oluşturuldu: hikaye_2500_kelime.html');
console.log('📄 PDF oluşturmak için tarayıcıda açıp yazdırın veya PDF olarak kaydedin');
console.log('🎨 Resimler için DALL-E promptları:');
console.log('1. "7 yaş Türk çocuk, evde beyaz kedi ile oynuyor, cartoon style, bright colors, cozy home"');
console.log('2. "7 yaş çocuk, sokakta aç köpek görüyor, sad expression, cartoon style, street scene"');
console.log('3. "7 yaş çocuk, öğretmen ile konuşuyor, classroom, educational, cartoon style"');
console.log('4. "Sınıf dolusu çocuk, hayvan barınağında yardım ediyor, happy faces, cartoon style"');
console.log('5. "7 yaş çocuk, kedi ve köpek ile birlikte, friendship, cartoon style, bright colors"');
console.log('6. "7 yaş çocuk, hasta kuşu veterinere götürüyor, caring, cartoon style"');
console.log('7. "7 yaş çocuk, kuşu doğaya bırakıyor, nature, cartoon style"');
console.log('8. "Mahalle çocukları, hayvanlara yardım ediyor, community, cartoon style"'); 