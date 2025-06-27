const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const PORT = process.env.PORT || 3001; // Backend server port

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello from ETEA Test Prep Backend!');
});

const { readDB, writeDB } = require('./dbUtils'); // Import DB utility functions

// --- API Endpoints ---

// Add a single MCQ
app.post('/api/mcqs/add-single', async (req, res) => {
  try {
    const { question, options, correctAnswer, subject } = req.body;

    // Basic validation
    if (!question || !options || !correctAnswer || !subject) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Options must be an array of 4 strings.' });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the provided options.' });
    }

    const dbData = await readDB();
    const newMcq = {
      id: uuidv4(),
      question,
      options,
      correctAnswer,
      subject,
      createdAt: new Date().toISOString(),
    };

    dbData.mcqs.push(newMcq);
    await writeDB(dbData);

    res.status(201).json({ message: 'MCQ added successfully!', mcq: newMcq });
  } catch (error) {
    console.error('Error adding single MCQ:', error);
    res.status(500).json({ message: 'Failed to add MCQ. Please try again.' });
  }
});

// Get all MCQs or filter by subject
app.get('/api/mcqs', async (req, res) => {
  try {
    const { subject } = req.query; // Check for subject query parameter
    const dbData = await readDB();
    let mcqsToReturn = dbData.mcqs;

    if (subject) {
      mcqsToReturn = mcqsToReturn.filter(mcq => mcq.subject.toLowerCase() === subject.toLowerCase());
    }

    res.status(200).json(mcqsToReturn);
  } catch (error) {
    console.error('Error fetching MCQs:', error);
    res.status(500).json({ message: 'Failed to fetch MCQs. Please try again.' });
  }
});

// Add bulk MCQs
app.post('/api/mcqs/add-bulk', async (req, res) => {
  try {
    const mcqsToAdd = req.body.mcqs; // Expecting an array of MCQ objects

    if (!Array.isArray(mcqsToAdd) || mcqsToAdd.length === 0) {
      return res.status(400).json({ message: 'Request body must be an array of MCQs and cannot be empty.' });
    }

    const dbData = await readDB();
    const addedMcqs = [];
    const validationErrors = [];

    for (const mcqData of mcqsToAdd) {
      const { question, options, correctAnswer, subject } = mcqData;
      // Basic validation for each MCQ
      if (!question || !options || !correctAnswer || !subject || !Array.isArray(options) || options.length !== 4 || !options.includes(correctAnswer)) {
        validationErrors.push({ message: 'Invalid MCQ data. Ensure all fields are present, options is an array of 4, and correctAnswer is one of the options.', mcqData });
        continue; // Skip this MCQ
      }

      const newMcq = {
        id: uuidv4(),
        question,
        options,
        correctAnswer,
        subject,
        createdAt: new Date().toISOString(),
      };
      dbData.mcqs.push(newMcq);
      addedMcqs.push(newMcq);
    }

    if (addedMcqs.length > 0) {
      await writeDB(dbData);
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: `Some MCQs failed validation. ${addedMcqs.length} MCQs added.`,
        addedCount: addedMcqs.length,
        errorCount: validationErrors.length,
        errors: validationErrors,
        addedMcqs: addedMcqs.length > 0 ? addedMcqs : undefined
      });
    }

    res.status(201).json({ message: `Successfully added ${addedMcqs.length} MCQs.`, mcqs: addedMcqs });
  } catch (error) {
    console.error('Error adding bulk MCQs:', error);
    res.status(500).json({ message: 'Failed to add bulk MCQs. Please try again.' });
  }
});


// Example: Load MCQs at startup (optional, endpoints can read on demand)
// async function loadInitialData() {
//   try {
//     const dbData = await readDB();
//     console.log("MCQs loaded from db.json");
//     // You might want to store dbData.mcqs in a variable if needed globally
//     // or just readDB() within each endpoint handler.
//   } catch (error) {
//     console.error("Failed to load initial data from db.json:", error);
//   }
// }
// loadInitialData();


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

// Export the app for potential testing or advanced configurations if needed
module.exports = app;
