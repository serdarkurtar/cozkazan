import express from 'express';
import Test from '../models/Test.js';
import TestSoru from '../models/TestSoru.js';
import multer from 'multer';
import xlsx from 'xlsx';
import stream from 'stream';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST api/tests/upload-excel/:testId
// @desc    Upload questions from an Excel file for a specific test
// @access  Private
router.post('/upload-excel/:testId', upload.single('excelFile'), async (req, res) => {
  const { testId } = req.params;

  if (!req.file) {
    return res.status(400).json({ msg: 'Lütfen bir dosya yükleyin.' });
  }

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ msg: 'Test bulunamadı.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Assuming the first row is headers, we skip it (i=1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 6) continue; // Skip empty or incomplete rows

      const [soruMetni, secenekA, secenekB, secenekC, secenekD, dogruCevap] = row;
      
      const newSoru = new TestSoru({
        testId: testId,
        soruMetni,
        secenekler: { A: secenekA, B: secenekB, C: secenekC, D: secenekD },
        dogruCevap,
      });
      await newSoru.save();
    }

    res.json({ msg: `${data.length - 1} soru başarıyla yüklendi.` });

  } catch (err) {
    console.error('Excel yükleme hatası:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   GET api/test-detay/:id
// @desc    Get test details with questions
// @access  Private
router.get('/test-detay/:id', async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findById(testId);
    
    if (!test) {
      return res.status(404).json({ msg: 'Test bulunamadı.' });
    }

    const sorular = await TestSoru.find({ testId: testId });
    
    res.json({
      _id: test._id,
      testAdi: test.testAdi,
      konu: test.konu,
      sorular: sorular
    });
  } catch (err) {
    console.error('Test detay hatası:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   PUT api/soru/:id
// @desc    Update a question
// @access  Private
router.put('/soru/:id', async (req, res) => {
  try {
    const soruId = req.params.id;
    const { soruMetni, secenekler, dogruCevap } = req.body;

    const soru = await TestSoru.findById(soruId);
    if (!soru) {
      return res.status(404).json({ msg: 'Soru bulunamadı.' });
    }

    soru.soruMetni = soruMetni;
    soru.secenekler = secenekler;
    soru.dogruCevap = dogruCevap;

    await soru.save();
    res.json({ msg: 'Soru başarıyla güncellendi.' });
  } catch (err) {
    console.error('Soru güncelleme hatası:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   DELETE api/soru/:id
// @desc    Delete a question
// @access  Private
router.delete('/soru/:id', async (req, res) => {
  try {
    const soruId = req.params.id;
    const { testId } = req.query;

    const soru = await TestSoru.findById(soruId);
    if (!soru) {
      return res.status(404).json({ msg: 'Soru bulunamadı.' });
    }

    await TestSoru.findByIdAndDelete(soruId);
    res.json({ msg: 'Soru başarıyla silindi.' });
  } catch (err) {
    console.error('Soru silme hatası:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// @route   DELETE api/tests/:id
// @desc    Delete a test and all its questions
// @access  Private (should be protected by auth middleware in a real app)
router.delete('/:id', async (req, res) => {
  try {
    const testId = req.params.id;

    // Find the test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ msg: 'Test not found' });
    }

    // Delete all questions associated with the test
    await TestSoru.deleteMany({ testId: testId });

    // Delete the test itself
    await Test.findByIdAndDelete(testId);

    res.json({ msg: 'Test and associated questions deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router; 