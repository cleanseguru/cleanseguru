const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin with your service account
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const userData = req.body;
    const { uid } = await admin.auth().verifyIdToken(userData.idToken);
    
    // Store additional user data in Firestore
    await admin.firestore().collection('users').doc(uid).set(userData);
    
    res.status(201).json({ message: 'User profile created successfully' });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }
    
    res.status(200).json({ 
      user: userDoc.data(),
      message: 'Authentication successful' 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Add this to your existing routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { userId, type } = req.body;
    
    let path;
    if (type === 'profile') {
      path = `profile-pictures/${userId}`;
    } else if (type === 'idcard') {
      path = `id-cards/${userId}/${type}`;
    }

    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(path);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      }
    });

    const url = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    res.json({ url: url[0] });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});