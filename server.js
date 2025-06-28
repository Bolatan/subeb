// At the top of your server file
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

const AUDITS_FILE = path.join(__dirname, 'audits.json');

// Helper functions
function loadAudits() {
  if (fs.existsSync(AUDITS_FILE)) {
    return JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8'));
  }
  return [];
}

function saveAudits(audits) {
  fs.writeFileSync(AUDITS_FILE, JSON.stringify(audits, null, 2));
}

// GET audits
app.get('/api/audits', (req, res) => {
  const audits = loadAudits();
  res.json(audits);
});

// POST audit
app.post('/api/audits', (req, res) => {
  const audits = loadAudits();
  audits.push(req.body);
  saveAudits(audits);
  res.json({ success: true });
});

// ...your other server code...

app.listen(3001, () => console.log('Server running on port 3001'));


// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save audit data
app.post('/api/audits', (req, res) => {
    try {
        const auditData = req.body;
        
        // Read existing data
        let audits = [];
        if (fs.existsSync('audits.json')) {
            const data = fs.readFileSync('audits.json', 'utf8');
            audits = JSON.parse(data);
        }
        
        // Add new audit
        audits.push({
            ...auditData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            synced: true
        });
        
        // Save to file
        fs.writeFileSync('audits.json', JSON.stringify(audits, null, 2));
        
        res.json({ success: true, message: 'Audit saved successfully' });
    } catch (error) {
        console.error('Error saving audit:', error);
        res.status(500).json({ success: false, message: 'Error saving audit' });
    }
});

// API endpoint to get all audits
app.get('/api/audits', (req, res) => {
    try {
        if (fs.existsSync('audits.json')) {
            const data = fs.readFileSync('audits.json', 'utf8');
            const audits = JSON.parse(data);
            res.json(audits);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading audits:', error);
        res.status(500).json({ success: false, message: 'Error reading audits' });
    }
});

// API endpoint for bulk sync
app.post('/api/sync', (req, res) => {
    try {
        const { audits } = req.body;
        
        // Read existing data
        let existingAudits = [];
        if (fs.existsSync('audits.json')) {
            const data = fs.readFileSync('audits.json', 'utf8');
            existingAudits = JSON.parse(data);
        }
        
        // Merge audits (avoid duplicates by ID)
        const existingIds = existingAudits.map(a => a.id);
        const newAudits = audits.filter(a => !existingIds.includes(a.id));
        
        const allAudits = [...existingAudits, ...newAudits];
        
        // Save to file
        fs.writeFileSync('audits.json', JSON.stringify(allAudits, null, 2));
        
        res.json({ 
            success: true, 
            message: `Synced ${newAudits.length} new audits`,
            totalAudits: allAudits.length 
        });
    } catch (error) {
        console.error('Error syncing data:', error);
        res.status(500).json({ success: false, message: 'Error syncing data' });
    }
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