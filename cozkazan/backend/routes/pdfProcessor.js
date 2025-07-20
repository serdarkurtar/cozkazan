import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// pdf-parse modülünü dinamik olarak import et
let pdf;
try {
    const pdfModule = await import('pdf-parse');
    pdf = pdfModule.default;
} catch (error) {
    console.error('pdf-parse modülü yüklenemedi:', error);
    pdf = null;
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/pdf');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Sadece PDF dosyaları kabul edilir!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// PDF'den metin çıkarma (ikinci sayfadan başla)
async function extractTextFromPDF(filePath) {
    try {
        if (!pdf) {
            throw new Error('pdf-parse modülü yüklenemedi');
        }
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        
        // İkinci sayfadan başla (ilk sayfa genelde tanıtım)
        const pages = data.text.split('\f'); // Sayfa ayırıcı
        let content = '';
        
        if (pages.length > 1) {
            // İkinci sayfadan itibaren al
            content = pages.slice(1).join('\n');
        } else {
            // Tek sayfa varsa tamamını al
            content = data.text;
        }
        
        return content;
    } catch (error) {
        console.error('PDF okuma hatası:', error);
        throw new Error('PDF dosyası okunamadı');
    }
}

// Soru tespit etme (geliştirilmiş)
function detectQuestions(text) {
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = null;
    let questionNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Soru numarası tespit etme (1., 2., 3. gibi veya 1), 2), 3) gibi)
        const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)$/);
        if (questionMatch) {
            // Önceki soruyu kaydet
            if (currentQuestion && currentQuestion.options.length >= 2) {
                questions.push(currentQuestion);
            }
            
            currentQuestion = {
                id: questionNumber++,
                question: questionMatch[2].trim(),
                options: [],
                correctAnswer: null,
                explanation: ''
            };
        }
        // Şık tespit etme (A), B), C), D) gibi veya A., B., C., D. gibi)
        else if (currentQuestion) {
            const optionMatch = line.match(/^([A-D])[\.\)]\s*(.+)$/);
            if (optionMatch) {
                currentQuestion.options.push({
                    letter: optionMatch[1],
                    text: optionMatch[2].trim()
                });
            }
            // Doğru cevap tespit etme (Cevap: A, Doğru: B gibi)
            else if (line.toLowerCase().includes('cevap:') || line.toLowerCase().includes('doğru:')) {
                const answerMatch = line.match(/(cevap|doğru):\s*([A-D])/i);
                if (answerMatch) {
                    currentQuestion.correctAnswer = answerMatch[2];
                }
            }
            // Açıklama tespit etme
            else if (line.toLowerCase().includes('açıklama:') || line.toLowerCase().includes('çözüm:')) {
                currentQuestion.explanation = line.replace(/^(açıklama|çözüm):\s*/i, '').trim();
            }
            // Soru devamı (şık olmayan ama soru ile ilgili satırlar)
            else if (line.length > 10 && !line.match(/^[A-D][\.\)]/)) {
                currentQuestion.question += ' ' + line;
            }
        }
    }
    
    // Son soruyu ekle
    if (currentQuestion && currentQuestion.options.length >= 2) {
        questions.push(currentQuestion);
    }
    
    return questions;
}

// Test oluşturma
function createTestFromQuestions(questions, testName, sinifId, dersId, konuId) {
    const tests = [];
    
    questions.forEach((question, index) => {
        if (question.options.length >= 2) { // En az 2 şık olmalı
            const test = {
                ad: `${testName} - Soru ${question.id}`,
                sinifId: sinifId,
                dersId: dersId,
                konuId: konuId,
                sorular: [{
                    soru: question.question,
                    secenekler: question.options.map(opt => opt.text),
                    dogruCevap: question.correctAnswer ? 
                        question.options.findIndex(opt => opt.letter === question.correctAnswer) : 0,
                    aciklama: question.explanation,
                    puan: 10
                }],
                toplamPuan: 10,
                aktif: true,
                createdAt: new Date()
            };
            
            tests.push(test);
        }
    });
    
    return tests;
}

// PDF yükleme ve işleme
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF dosyası yüklenmedi' });
        }

        const { sinifId, dersId, konuId, testName } = req.body;
        
        if (!sinifId || !dersId || !konuId || !testName) {
            return res.status(400).json({ error: 'Eksik parametreler' });
        }

        // PDF'den metin çıkar (ikinci sayfadan başla)
        const text = await extractTextFromPDF(req.file.path);
        
        // Soruları tespit et
        const questions = detectQuestions(text);
        
        if (questions.length === 0) {
            // Soru bulunamadıysa manuel test oluştur
            const count = parseInt(req.body.questionCount) || 5;
            const tests = [];
            
            for (let i = 1; i <= count; i++) {
                const test = {
                    ad: `${testName} - Soru ${i}`,
                    sinifId: sinifId,
                    dersId: dersId,
                    konuId: konuId,
                    sorular: [{
                        soru: `PDF'den oluşturulan ${i}. soru`,
                        secenekler: ['A) Seçenek A', 'B) Seçenek B', 'C) Seçenek C', 'D) Seçenek D'],
                        dogruCevap: 0,
                        aciklama: 'PDF içeriği manuel olarak düzenlenmelidir.',
                        puan: 10
                    }],
                    toplamPuan: 10,
                    aktif: true,
                    createdAt: new Date()
                };
                
                tests.push(test);
            }
            
            // Dosyayı sil
            fs.unlinkSync(req.file.path);

            res.json({
                success: true,
                message: `${tests.length} manuel test oluşturuldu`,
                tests: tests,
                note: 'PDF\'de soru bulunamadığı için manuel testler oluşturuldu. Testleri düzenleyerek gerçek soruları ekleyebilirsiniz.'
            });
            return;
        }

        // Testleri oluştur
        const tests = createTestFromQuestions(questions, testName, sinifId, dersId, konuId);
        
        // Dosyayı sil
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `${tests.length} otomatik test oluşturuldu`,
            tests: tests,
            totalQuestions: questions.length,
            processedQuestions: tests.length,
            note: 'PDF\'den otomatik olarak sorular algılandı ve testler oluşturuldu.'
        });

    } catch (error) {
        console.error('PDF işleme hatası:', error);
        
        // Hata durumunda dosyayı sil
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            error: 'PDF işlenirken hata oluştu',
            details: error.message 
        });
    }
});

// PDF önizleme (metin çıkarma)
router.post('/preview-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF dosyası yüklenmedi' });
        }

        // PDF'den metin çıkar (ikinci sayfadan başla)
        const text = await extractTextFromPDF(req.file.path);
        
        // Soruları tespit et
        const questions = detectQuestions(text);
        
        const fileInfo = {
            name: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        };

        // Dosyayı sil
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'PDF dosyası başarıyla yüklendi',
            fileInfo: fileInfo,
            text: text.substring(0, 1000) + '...', // İlk 1000 karakter
            questions: questions.slice(0, 5), // İlk 5 soru
            totalQuestions: questions.length,
            note: questions.length > 0 ? 
                `${questions.length} soru otomatik olarak algılandı.` : 
                'PDF\'de soru bulunamadı. Manuel test oluşturma seçeneği kullanılacak.'
        });

    } catch (error) {
        console.error('PDF önizleme hatası:', error);
        
        // Hata durumunda dosyayı sil
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            error: 'PDF önizlenirken hata oluştu',
            details: error.message 
        });
    }
});

export default router; 