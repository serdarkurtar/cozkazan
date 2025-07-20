const express = require('express');
const mongoose = require('mongoose');
const Test = require('../models/Test');
const TestSoru = require('../models/TestSoru');

const router = express.Router();

// Question editor page
router.get('/:testId/edit-questions', async (req, res) => {
  try {
    const { testId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).send('Geçersiz Test ID!');
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).send('Test bulunamadı!');
    }

    const questions = await TestSoru.find({ testId: testId }).sort('createdAt');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Sorularını Düzenle - ${test.aciklama}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
          .question { border: 1px solid #ddd; margin: 15px 0; padding: 15px; border-radius: 5px; background: #fafafa; }
          .question h3 { margin-top: 0; color: #333; }
          .option { margin: 10px 0; }
          .option label { display: block; margin-bottom: 5px; font-weight: bold; }
          .option input, .option textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
          .option textarea { height: 80px; resize: vertical; }
          .correct-option { background: #e8f5e8; border: 1px solid #4caf50; }
          .save-btn { background: #4caf50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; }
          .save-btn:hover { background: #45a049; }
          .back-btn { background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
          .back-btn:hover { background: #1976D2; }
          .add-question { background: #ff9800; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 20px 0; }
          .add-question:hover { background: #f57c00; }
          .delete-btn { background: #f44336; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; float: right; }
          .delete-btn:hover { background: #d32f2f; }
          .success { color: green; margin: 10px 0; }
          .error { color: red; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Test Sorularını Düzenle</h1>
            <a href="/admin/resources/Test" class="back-btn">← Admin Paneline Dön</a>
          </div>
          
          <h2>Test: ${test.aciklama}</h2>
          <p><strong>Sınıf:</strong> ${test.sinif} | <strong>Ders:</strong> ${test.ders} | <strong>Konu:</strong> ${test.konu}</p>
          
          <button class="add-question" onclick="addNewQuestion()">➕ Yeni Soru Ekle</button>
          
          <div id="questions-container">
            ${questions.map((question, index) => `
              <div class="question" data-question-id="${question._id}">
                <button class="delete-btn" onclick="deleteQuestion('${question._id}')">🗑️</button>
                <h3>Soru ${index + 1}</h3>
                <div class="option">
                  <label>Soru Metni:</label>
                  <textarea id="soru-${question._id}" onchange="updateQuestion('${question._id}')">${question.soruMetni}</textarea>
                </div>
                ${question.secenekler.map((secenek, secenekIndex) => `
                  <div class="option">
                    <label>Seçenek ${String.fromCharCode(65 + secenekIndex)}:</label>
                    <input type="text" id="secenek-${question._id}-${secenekIndex}" value="${secenek}" onchange="updateQuestion('${question._id}')">
                  </div>
                `).join('')}
                <div class="option">
                  <label>Doğru Seçenek:</label>
                  <select id="dogru-${question._id}" onchange="updateQuestion('${question._id}')">
                    ${question.secenekler.map((secenek, secenekIndex) => `
                      <option value="${secenek}" ${secenek === question.dogruSecenek ? 'selected' : ''}>
                        ${String.fromCharCode(65 + secenekIndex)}: ${secenek}
                      </option>
                    `).join('')}
                  </select>
                </div>
                <button class="save-btn" onclick="saveQuestion('${question._id}')">💾 Kaydet</button>
              </div>
            `).join('')}
          </div>
          
          <div id="message"></div>
        </div>

        <script>
          let saveTimeout = {};
          
          function updateQuestion(questionId) {
            clearTimeout(saveTimeout[questionId]);
            saveTimeout[questionId] = setTimeout(() => saveQuestion(questionId), 1000);
          }
          
          async function saveQuestion(questionId) {
            const questionDiv = document.querySelector(\`[data-question-id="\${questionId}"]\`);
            const soruMetni = document.getElementById(\`soru-\${questionId}\`).value;
            const secenekler = [];
            for (let i = 0; i < 4; i++) {
              const secenek = document.getElementById(\`secenek-\${questionId}-\${i}\`).value;
              if (secenek.trim()) secenekler.push(secenek);
            }
            const dogruSecenek = document.getElementById(\`dogru-\${questionId}\`).value;
            
            try {
              const response = await fetch(\`/api/test/question/\${questionId}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soruMetni, secenekler, dogruSecenek })
              });
              
              if (response.ok) {
                showMessage('Soru başarıyla güncellendi!', 'success');
              } else {
                const error = await response.json();
                showMessage('Hata: ' + error.error, 'error');
              }
            } catch (error) {
              showMessage('Hata: ' + error.message, 'error');
            }
          }
          
          async function deleteQuestion(questionId) {
            if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
            
            try {
              const response = await fetch(\`/api/test/question/\${questionId}\`, {
                method: 'DELETE'
              });
              
              if (response.ok) {
                document.querySelector(\`[data-question-id="\${questionId}"]\`).remove();
                showMessage('Soru başarıyla silindi!', 'success');
              } else {
                const error = await response.json();
                showMessage('Hata: ' + error.error, 'error');
              }
            } catch (error) {
              showMessage('Hata: ' + error.message, 'error');
            }
          }
          
          function addNewQuestion() {
            const container = document.getElementById('questions-container');
            const questionCount = container.children.length;
            const newQuestionId = 'new-' + Date.now();
            
            const newQuestionHtml = \`
              <div class="question" data-question-id="\${newQuestionId}">
                <h3>Yeni Soru</h3>
                <div class="option">
                  <label>Soru Metni:</label>
                  <textarea id="soru-\${newQuestionId}"></textarea>
                </div>
                <div class="option">
                  <label>Seçenek A:</label>
                  <input type="text" id="secenek-\${newQuestionId}-0">
                </div>
                <div class="option">
                  <label>Seçenek B:</label>
                  <input type="text" id="secenek-\${newQuestionId}-1">
                </div>
                <div class="option">
                  <label>Seçenek C:</label>
                  <input type="text" id="secenek-\${newQuestionId}-2">
                </div>
                <div class="option">
                  <label>Seçenek D:</label>
                  <input type="text" id="secenek-\${newQuestionId}-3">
                </div>
                <div class="option">
                  <label>Doğru Seçenek:</label>
                  <select id="dogru-\${newQuestionId}">
                    <option value="">Seçiniz</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <button class="save-btn" onclick="createNewQuestion('\${newQuestionId}')">➕ Yeni Soru Oluştur</button>
              </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', newQuestionHtml);
          }
          
          async function createNewQuestion(questionId) {
            const soruMetni = document.getElementById(\`soru-\${questionId}\`).value;
            const secenekler = [];
            for (let i = 0; i < 4; i++) {
              const secenek = document.getElementById(\`secenek-\${questionId}-\${i}\`).value;
              if (secenek.trim()) secenekler.push(secenek);
            }
            const dogruSecenek = document.getElementById(\`dogru-\${questionId}\`).value;
            
            if (!soruMetni || secenekler.length < 2 || !dogruSecenek) {
              showMessage('Lütfen tüm alanları doldurun!', 'error');
              return;
            }
            
            try {
              const response = await fetch('/api/test/${testId}/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soruMetni, secenekler, dogruSecenek })
              });
              
              if (response.ok) {
                location.reload(); // Reload to show the new question with proper ID
              } else {
                const error = await response.json();
                showMessage('Hata: ' + error.error, 'error');
              }
            } catch (error) {
              showMessage('Hata: ' + error.message, 'error');
            }
          }
          
          function showMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = \`<div class="\${type}">\${message}</div>\`;
            setTimeout(() => messageDiv.innerHTML = '', 3000);
          }
        </script>
      </body>
      </html>
    `;

    res.send(html);

  } catch (error) {
    console.error('Question editor error:', error);
    res.status(500).send('Sunucu hatası: ' + error.message);
  }
});

// Create new question
router.post('/:testId/questions', async (req, res) => {
  try {
    const { testId } = req.params;
    const { soruMetni, secenekler, dogruSecenek } = req.body;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Geçersiz Test ID!' });
    }

    const newQuestion = new TestSoru({
      testId: testId,
      soruMetni,
      secenekler,
      dogruSecenek
    });

    await newQuestion.save();
    res.json(newQuestion);

  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Soru oluşturulurken hata: ' + error.message });
  }
});

// Delete a question
router.delete('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Geçersiz Soru ID!' });
    }

    const deletedQuestion = await TestSoru.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Soru bulunamadı!' });
    }

    res.json({ success: true, message: 'Soru başarıyla silindi!' });

  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Soru silinirken hata: ' + error.message });
  }
});

module.exports = router; 