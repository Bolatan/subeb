// Utility to parse the Lagos State CSV and update audits in MongoDB
// Usage: node update_audits_from_csv.js <csvFilePath>

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParse = require('csv-parse/lib/sync');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
  photos: [String],
  auditor: String,
  timestamp: String,
  synced: Boolean
}, { versionKey: false });
const Audit = mongoose.model('Audit', auditSchema);

async function main() {
  const csvFile = process.argv[2];
  if (!csvFile) {
    console.error('Usage: node update_audits_from_csv.js <csvFilePath>');
    process.exit(1);
  }
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const records = csvParse(csvContent, { skip_empty_lines: true });

  // Find the header row (S/N,Local government,...)
  let headerIdx = records.findIndex(row => row[0] && row[0].toLowerCase().includes('s/n'));
  if (headerIdx === -1) {
    console.error('Could not find header row in CSV.');
    process.exit(1);
  }
  const header = records[headerIdx];
  const dataRows = records.slice(headerIdx + 1);

  let updated = 0, created = 0;
  for (const row of dataRows) {
    if (!row[0] || isNaN(Number(row[0]))) continue; // skip non-data rows
    const id = Number(row[0]);
    const localGov = row[1] || '';
    const schoolName = row[3] || '';
    const schoolAddress = row[4] || '';
    // Upsert audit by id
    const result = await Audit.findOneAndUpdate(
      { id },
      {
        id,
        localGov,
        schoolName,
        schoolAddress,
        synced: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result) updated++;
    else created++;
  }
  console.log(`Updated/created ${updated} audits from CSV.`);
  process.exit(0);
}

main();
