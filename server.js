const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Audit Schema
const auditSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  schoolName: String,
  localGov: String,
  schoolAddress: String,
  latitude: Number,
  longitude: Number,
  principalName: String,
  totalTeachers: Number,
  totalStudents: Number,
  facilityCondition: String,
  additionalNotes: String,
  photos: [
    {
      name: String,
      data: String,
      type: String
    }
  ],
  auditor: String,
  timestamp: String,
  synced: Boolean
}, { versionKey: false });

const Audit = mongoose.model('Audit', auditSchema);

// GET audits
app.get('/api/audits', async (req, res) => {
  try {
    const audits = await Audit.find({});
    res.json(audits);
  } catch (error) {
    console.error('Error fetching audits:', error);
    res.status(500).json({ success: false, message: 'Error fetching audits' });
  }
});

// POST audit
app.post('/api/audits', async (req, res) => {
  try {
    let audit = req.body;
    // Ensure photos is always an array of objects
    if (!Array.isArray(audit.photos)) {
      if (typeof audit.photos === 'string' && audit.photos.trim() !== '') {
        // If it's a string (e.g. from CSV), convert to array of objects with name only
        audit.photos = audit.photos.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
      } else {
        audit.photos = [];
      }
    } else {
      // If array, ensure each item is an object
      audit.photos = audit.photos.map(photo => {
        if (typeof photo === 'string') {
          return { name: photo, data: '', type: '' };
        }
        return photo;
      });
    }
    const newAudit = new Audit({ ...audit, synced: true });
    await newAudit.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving audit:', error);
    res.status(500).json({ success: false, message: 'Error saving audit' });
  }
});

// POST bulk sync audits
app.post('/api/sync', async (req, res) => {
  try {
    const { audits } = req.body;
    if (!Array.isArray(audits)) return res.status(400).json({ success: false, message: 'Invalid audits array' });
    const existing = await Audit.find({}, 'id');
    const existingIds = new Set(existing.map(a => a.id));
    // Ensure photos is always an array of objects for each audit
    const newAudits = audits.filter(a => !existingIds.has(a.id)).map(audit => {
      let photos = audit.photos;
      if (!Array.isArray(photos)) {
        if (typeof photos === 'string' && photos.trim() !== '') {
          photos = photos.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
        } else {
          photos = [];
        }
      } else {
        photos = photos.map(photo => {
          if (typeof photo === 'string') {
            return { name: photo, data: '', type: '' };
          }
          return photo;
        });
      }
      return { ...audit, photos, synced: true };
    });
    if (newAudits.length > 0) await Audit.insertMany(newAudits);
    const totalAudits = await Audit.countDocuments();
    res.json({ success: true, message: `Synced ${newAudits.length} new audits`, totalAudits });
  } catch (error) {
    console.error('Error syncing audits:', error);
    res.status(500).json({ success: false, message: 'Error syncing audits' });
  }
});

// Serve the HTML file
const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Create package.json setup instructions
console.log(`
To set up this server:
1. Create package.json: npm init -y
2. Install dependencies: npm install express
3. Run server: node server.js
`);