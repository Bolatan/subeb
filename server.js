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
  photos: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.every(item => typeof item === 'string');
      },
      message: 'Photos must be an array of strings'
    }
  },
  auditor: String,
  timestamp: String,
  synced: Boolean
}, { versionKey: false });

const Audit = mongoose.model('Audit', auditSchema);

// Image Schema for storing images in MongoDB
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  data: { type: Buffer, required: true },
  type: { type: String, required: true }
}, { versionKey: false });

const Image = mongoose.model('Image', imageSchema);

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

// Before validation/saving
const fixPhotosField = (photosValue) => {
  if (!photosValue) return [];
  if (typeof photosValue === 'string') {
    try {
      // Remove problematic characters and parse
      const cleaned = photosValue
        .replace(/\n/g, '') // Remove newlines
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse photos:', photosValue);
      return [];
    }
  }
  return Array.isArray(photosValue) ? photosValue : [];
};

// Utility to process photos as array of strings (filenames only)
const processPhotos = (photosData) => {
  if (!photosData) return [];
  // If it's a stringified array, parse it first
  if (typeof photosData === 'string') {
    try {
      photosData = JSON.parse(photosData);
    } catch (e) {
      return [];
    }
  }
  // Extract just the name property from each photo object
  return Array.isArray(photosData)
    ? photosData.map(photo =>
        typeof photo === 'object' && photo.name ? photo.name : String(photo)
      )
    : [];
};

// POST audit
app.post('/api/audits', async (req, res) => {
  try {
    let audit = req.body;
    // Ensure id is present, a number, and unique
    if (!audit.id || isNaN(Number(audit.id))) {
      return res.status(400).json({ success: false, message: 'Missing or invalid id (must be a unique number)' });
    }
    audit.id = Number(audit.id);
    // Robustly handle photos field (guarantee array of objects)
    let photos = audit.photos;
    if (!Array.isArray(photos)) {
      if (typeof photos === 'string' && photos.trim() !== '') {
        let str = photos.trim();
        if (str.startsWith('[') && str.endsWith(']')) {
          try {
            let fixed = str.replace(/'/g, '"');
            const parsed = JSON.parse(fixed);
            if (Array.isArray(parsed)) {
              photos = parsed.map(photo => {
                if (typeof photo === 'string') {
                  return { name: photo, data: '', type: '' };
                }
                return photo;
              });
            } else {
              photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
            }
          } catch {
            photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
          }
        } else {
          photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
        }
      } else if (typeof photos === 'object' && photos !== null) {
        photos = [photos];
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
    // If photos is a string that should be an array
    if (typeof photos === 'string') {
      try {
        photos = JSON.parse(photos);
      } catch (e) {
        console.error('Failed to parse photos JSON:', photos);
        photos = [];
      }
    }
    // Example validation for photos array
    if (Array.isArray(photos) && photos.every(photo => typeof photo === 'string')) {
      // Proceed with sync (already handled by normalization below)
    } else if (!Array.isArray(photos) || !photos.every(photo => typeof photo === 'string' || (typeof photo === 'object' && photo !== null && typeof photo.name === 'string'))) {
      // Handle invalid data
      console.error('Invalid photos format:', photos);
      photos = [];
    }
    // Clean the data before validation
    photos = (Array.isArray(photos) ? photos : []).map(photo =>
      typeof photo === 'string' ? photo.trim() : photo
    ).filter(photo => {
      if (typeof photo === 'string') return photo.length > 0;
      if (typeof photo === 'object' && photo !== null) return !!photo.name;
      return false;
    });
    // Now robustly convert all to objects
    audit.photos = photos;
    audit.photos = audit.photos.map(photo => {
      if (typeof photo === 'string') {
        return { name: photo, data: '', type: '' };
      }
      if (typeof photo === 'object' && photo !== null) {
        return {
          name: photo.name || '',
          data: photo.data || '',
          type: photo.type || ''
        };
      }
      return null;
    }).filter(p => p && typeof p.name === 'string' && p.name);
    // Ensure numeric fields are numbers
    audit.totalTeachers = Number(audit.totalTeachers) || 0;
    audit.totalStudents = Number(audit.totalStudents) || 0;
    audit.latitude = audit.latitude !== undefined && audit.latitude !== null && audit.latitude !== '' ? Number(audit.latitude) : null;
    audit.longitude = audit.longitude !== undefined && audit.longitude !== null && audit.longitude !== '' ? Number(audit.longitude) : null;
    // Apply the fix
    audit.photos = fixPhotosField(audit.photos);
    audit.photos = processPhotos(audit.photos);
    const newAudit = new Audit({ ...audit, synced: true });
    await newAudit.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving audit:', error);
    res.status(500).json({ success: false, message: 'Error saving audit', error: error.message });
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
    const newAudits = audits.filter(a => !existingIds.has(Number(a.id))).map(audit => {
      // Ensure id is a number
      audit.id = Number(audit.id);
      // Robustly handle photos field (guarantee array of objects)
      let photos = audit.photos;
      if (!Array.isArray(photos)) {
        if (typeof photos === 'string' && photos.trim() !== '') {
          let str = photos.trim();
          if (str.startsWith('[') && str.endsWith(']')) {
            try {
              let fixed = str.replace(/'/g, '"');
              const parsed = JSON.parse(fixed);
              if (Array.isArray(parsed)) {
                photos = parsed.map(photo => {
                  if (typeof photo === 'string') {
                    return { name: photo, data: '', type: '' };
                  }
                  return photo;
                });
              } else {
                photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
              }
            } catch {
              photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
            }
          } else {
            photos = str.split(';').map(name => ({ name: name.trim(), data: '', type: '' }));
          }
        } else if (typeof photos === 'object' && photos !== null) {
          photos = [photos];
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
      // If photos is a string that should be an array
      if (typeof photos === 'string') {
        try {
          photos = JSON.parse(photos);
        } catch (e) {
          console.error('Failed to parse photos JSON:', photos);
          photos = [];
        }
      }
      // Example validation for photos array
      if (Array.isArray(photos) && photos.every(photo => typeof photo === 'string')) {
        // Proceed with sync (already handled by normalization below)
      } else if (!Array.isArray(photos) || !photos.every(photo => typeof photo === 'string' || (typeof photo === 'object' && photo !== null && typeof photo.name === 'string'))) {
        // Handle invalid data
        console.error('Invalid photos format:', photos);
        photos = [];
      }
      // Clean the data before validation
      photos = (Array.isArray(photos) ? photos : []).map(photo =>
        typeof photo === 'string' ? photo.trim() : photo
      ).filter(photo => {
        if (typeof photo === 'string') return photo.length > 0;
        if (typeof photo === 'object' && photo !== null) return !!photo.name;
        return false;
      });
      // Now robustly convert all to objects
      audit.photos = photos;
      audit.photos = audit.photos.map(photo => {
        if (typeof photo === 'string') {
          return { name: photo, data: '', type: '' };
        }
        if (typeof photo === 'object' && photo !== null) {
          return {
            name: photo.name || '',
            data: photo.data || '',
            type: photo.type || ''
          };
        }
        return null;
      }).filter(p => p && typeof p.name === 'string' && p.name);
      // Ensure numeric fields are numbers
      audit.totalTeachers = Number(audit.totalTeachers) || 0;
      audit.totalStudents = Number(audit.totalStudents) || 0;
      audit.latitude = audit.latitude !== undefined && audit.latitude !== null && audit.latitude !== '' ? Number(audit.latitude) : null;
      audit.longitude = audit.longitude !== undefined && audit.longitude !== null && audit.longitude !== '' ? Number(audit.longitude) : null;
      // Apply the fix to photos before validation/saving
      audit.photos = fixPhotosField(audit.photos);
      audit.photos = processPhotos(audit.photos);
      return { ...audit, photos: processPhotos(audit.photos), synced: true };
    });
    if (newAudits.length > 0) await Audit.insertMany(newAudits);
    const totalAudits = await Audit.countDocuments();
    res.json({ success: true, message: `Synced ${newAudits.length} new audits`, totalAudits });
  } catch (error) {
    console.error('Error syncing audits:', error);
    res.status(500).json({ success: false, message: 'Error syncing audits', error: error.message });
  }
});

// Endpoint to serve image by filename from MongoDB
app.get('/api/photo/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const image = await Image.findOne({ filename });
    if (!image) return res.status(404).send('Image not found');
    res.set('Content-Type', image.type);
    res.send(image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Endpoint to upload image to MongoDB (expects { filename, data (base64), type })
app.post('/api/photo', async (req, res) => {
  try {
    const { filename, data, type } = req.body;
    if (!filename || !data || !type) {
      return res.status(400).json({ success: false, message: 'Missing filename, data, or type' });
    }
    // Convert base64 to Buffer
    const buffer = Buffer.from(data, data.startsWith('data:') ? data.split(',')[1] : data, 'base64');
    // Upsert image
    await Image.findOneAndUpdate(
      { filename },
      { filename, data: buffer, type },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ success: false, message: 'Error saving image', error: error.message });
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