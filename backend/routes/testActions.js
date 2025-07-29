const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const mongoose = require('mongoose');
const Test = require('../models/Test');
const TestSoru = require('../models/TestSoru');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece Excel dosyaları (.xlsx, .xls) kabul edilir!'));
    }
  }
});

// Excel upload endpoint
router.post('/upload-excel', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi!' });
    }

    const testId = req.body.testId;
    if (!testId) {
      return res.status(400).json({ error: 'Test ID gerekli!' });
    }

    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test bulunamadı!' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Delete existing questions for this test
    await TestSoru.deleteMany({ testId: testId });

    // Insert new questions
    const questions = data.map(row => ({
      testId: testId,
      soruMetni: row.soru || row.Soru || row.SORU || '',
      secenekler: [
        row.secenekA || row.SecenekA || row.SECENEKA || '',
        row.secenekB || row.SecenekB || row.SECENEKB || '',
        row.secenekC || row.SecenekC || row.SECENEKC || '',
        row.secenekD || row.SecenekD || row.SECENEKD || ''
      ].filter(secenek => secenek && secenek.trim() !== ''),
      dogruSecenek: row.dogruSecenek || row.DogruSecenek || row.DOGRUSECENEK || ''
    }));

    await TestSoru.insertMany(questions);

    res.json({ 
      success: true, 
      message: `${questions.length} soru başarıyla yüklendi!`,
      questionsCount: questions.length 
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    res.status(500).json({ error: 'Excel yükleme hatası: ' + error.message });
  }
});

// Get questions for a test
router.get('/:testId/questions', async (req, res) => {
  try {
    const { testId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Geçersiz Test ID!' });
    }

    const questions = await TestSoru.find({ testId: testId }).sort('createdAt');
    res.json(questions);

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Sorular yüklenirken hata: ' + error.message });
  }
});

// Update a question
router.put('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { soruMetni, secenekler, dogruSecenek } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Geçersiz Soru ID!' });
    }

    const updatedQuestion = await TestSoru.findByIdAndUpdate(
      questionId,
      {
        soruMetni,
        secenekler,
        dogruSecenek,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Soru bulunamadı!' });
    }

    res.json(updatedQuestion);

  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Soru güncellenirken hata: ' + error.message });
  }
});

// Delete a test and all its questions
router.delete('/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Geçersiz Test ID!' });
    }

    // Delete all questions for this test
    await TestSoru.deleteMany({ testId: testId });

    // Delete the test
    const deletedTest = await Test.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ error: 'Test bulunamadı!' });
    }

    res.json({ 
      success: true, 
      message: 'Test ve tüm soruları başarıyla silindi!' 
    });

  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ error: 'Test silinirken hata: ' + error.message });
  }
});

module.exports = router; 