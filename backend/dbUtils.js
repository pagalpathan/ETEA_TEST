const fs = require('fs').promises; // Use promises version of fs for async operations
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Function to read data from db.json
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or other read error, assume empty DB structure
    if (error.code === 'ENOENT') {
      console.warn('db.json not found, returning empty structure. It will be created on first write.');
      return { mcqs: [] };
    }
    console.error('Error reading database file:', error);
    throw error; // Re-throw error for caller to handle
  }
}

// Function to write data to db.json
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error; // Re-throw error for caller to handle
  }
}

module.exports = {
  readDB,
  writeDB,
};
