const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4lhsmEH8OQWlkUfSR0a3jvY0_EHiXEiA",
  authDomain: "cozkazan-app.firebaseapp.com",
  projectId: "cozkazan-app",
  storageBucket: "cozkazan-app.firebasestorage.app",
  messagingSenderId: "846053857270",
  appId: "1:846053857270:web:d2ba3637824325d5e519d7",
  measurementId: "G-DZ0NNZHW7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearFirebaseData() {
  try {
    console.log('🧹 Firebase verileri temizleniyor...');

    const collections = ['siniflar', 'dersler', 'konular', 'testler', 'sorular', 'test_havuzlari', 'hikayeler'];

    for (const collectionName of collections) {
      console.log(`🗑️ ${collectionName} koleksiyonu temizleniyor...`);
      const querySnapshot = await getDocs(collection(db, collectionName));
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`✅ ${querySnapshot.size} ${collectionName} silindi`);
    }

    console.log('🎉 Tüm Firebase verileri temizlendi!');

  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

clearFirebaseData(); 