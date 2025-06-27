import React, { useState } from 'react';

const ADMIN_KEY = "EDUCATOr.0312.nbk"; // For now, hardcoded. Discuss .env later.

const AdminPage: React.FC = () => {
  const [enteredKey, setEnteredKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(true);

  // Single MCQ state
  const [question, setQuestion] = useState<string>('');
  const [option1, setOption1] = useState<string>('');
  const [option2, setOption2] = useState<string>('');
  const [option3, setOption3] = useState<string>('');
  const [option4, setOption4] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  // Bulk MCQ state
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredKey === ADMIN_KEY) {
      setIsAuthenticated(true);
      setShowKeyInput(false);
    } else {
      alert('Invalid Admin Key');
      setEnteredKey('');
    }
  };

  const handleSingleMcqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!question || !option1 || !option2 || !option3 || !option4 || !correctAnswer || !subject) {
      alert('Please fill all fields for single MCQ upload.');
      return;
    }
    const newMcq = { question, options: [option1, option2, option3, option4], correctAnswer, subject };
    console.log('Submitting new MCQ:', newMcq);
    // Basic validation (client-side)
    if (!question || !option1 || !option2 || !option3 || !option4 || !correctAnswer || !subject) {
      alert('Please fill all fields for single MCQ upload.');
      return;
    }
    // Ensure correctAnswer is one of the options (client-side check)
    const optionsArray = [option1, option2, option3, option4];
    if (!optionsArray.includes(correctAnswer)) {
        alert('Correct Answer must exactly match one of the provided options.');
        return;
    }

    const mcqData = {
      question,
      options: optionsArray,
      correctAnswer,
      subject
    };

    fetch('http://localhost:3001/api/mcqs/add-single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mcqData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.mcq && data.mcq.id) {
        alert(`MCQ added successfully! ID: ${data.mcq.id}`);
        // Reset form
        setQuestion('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
        setCorrectAnswer('');
        setSubject('');
      } else {
        alert(`Error: ${data.message || 'Failed to add MCQ.'}`);
      }
    })
    .catch(error => {
      console.error('Error submitting single MCQ:', error);
      alert('An error occurred while submitting the MCQ. See console for details.');
    });
  };

  const handleBulkMcqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) {
      alert('Please select a file for bulk upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        let mcqsPayload;

        if (bulkFile.name.endsWith('.json')) {
          mcqsPayload = { mcqs: JSON.parse(fileContent) };
        } else if (bulkFile.name.endsWith('.csv')) {
          // Basic CSV parsing (assumes no commas within fields, simple structure)
          // For robust CSV parsing, a library like PapaParse would be better
          const lines = fileContent.split(/\r\n|\n/);
          const headers = lines[0].split(',').map(h => h.trim());
          const expectedHeaders = ['question', 'option1', 'option2', 'option3', 'option4', 'correctAnswer', 'subject'];
          // Basic header check - can be made more robust
          if (headers.length !== expectedHeaders.length || !expectedHeaders.every((h, i) => headers[i] === h)) {
            alert('CSV headers are incorrect. Expected: question,option1,option2,option3,option4,correctAnswer,subject');
            return;
          }

          const mcqsArray = lines.slice(1).filter(line => line.trim() !== '').map(line => {
            const values = line.split(',');
            return {
              question: values[0],
              options: [values[1], values[2], values[3], values[4]],
              correctAnswer: values[5],
              subject: values[6],
            };
          });
          mcqsPayload = { mcqs: mcqsArray };
        } else {
          alert('Unsupported file type. Please upload JSON or CSV.');
          return;
        }

        const response = await fetch('http://localhost:3001/api/mcqs/add-bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mcqsPayload),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || `Bulk upload processed. Added: ${data.mcqs?.length || data.addedCount || 0}`);
        } else {
          let errorMessage = `Error: ${data.message || 'Failed to upload bulk MCQs.'}`;
          if (data.errors && data.errors.length > 0) {
            errorMessage += `\nDetails: ${JSON.stringify(data.errors.slice(0, 3))} (first 3 errors shown)`;
          }
          alert(errorMessage);
        }

      } catch (parseError) {
        console.error('Error processing bulk file:', parseError);
        alert('Error processing file. Make sure it is valid JSON or CSV. See console for details.');
      } finally {
        // Reset form
        setBulkFile(null);
        const fileInput = document.getElementById('bulk-mcq-file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
      }
    };

    reader.onerror = () => {
      alert('Error reading file.');
      setBulkFile(null);
    };

    reader.readAsText(bulkFile);
  };

  if (showKeyInput) {
    // Clear the file input visually (if possible, depends on browser/React handling)
    const fileInput = document.getElementById('bulk-mcq-file') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleKeySubmit}>
            <div className="mb-4">
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Admin Key:
              </label>
              <input
                type="password"
                id="adminKey"
                value={enteredKey}
                onChange={(e) => setEnteredKey(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This case should ideally not be reached if showKeyInput is managed correctly
    return <p>Redirecting or error...</p>;
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Panel - MCQ Management</h1>

      {/* Single MCQ Upload Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Single MCQ</h2>
        <form onSubmit={handleSingleMcqSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question:</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              required
            />
          </div>

          {/* Options */}
          <div>
            <label htmlFor="option1" className="block text-sm font-medium text-gray-700">Option 1:</label>
            <input
              type="text"
              id="option1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="option2" className="block text-sm font-medium text-gray-700">Option 2:</label>
            <input
              type="text"
              id="option2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="option3" className="block text-sm font-medium text-gray-700">Option 3:</label>
            <input
              type="text"
              id="option3"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="option4" className="block text-sm font-medium text-gray-700">Option 4:</label>
            <input
              type="text"
              id="option4"
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">Correct Answer (enter the text of the correct option e.g. Option 1):</label>
            <input
              type="text"
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Physics, Chemistry"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Upload Single MCQ
          </button>
        </form>
      </section>

      {/* Bulk MCQ Upload Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Bulk MCQs (CSV/JSON)</h2>
        <form onSubmit={handleBulkMcqSubmit} className="space-y-4">
          <div>
            <label htmlFor="bulk-mcq-file" className="block text-sm font-medium text-gray-700">
              Upload File:
            </label>
            <input
              type="file"
              id="bulk-mcq-file"
              accept=".csv, application/json"
              onChange={(e) => setBulkFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: CSV, JSON. <br />
              CSV columns: question, option1, option2, option3, option4, correctAnswer, subject <br />
              JSON: Array of objects with keys: question, options (array of 4 strings), correctAnswer (string), subject (string)
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Upload Bulk MCQs
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
