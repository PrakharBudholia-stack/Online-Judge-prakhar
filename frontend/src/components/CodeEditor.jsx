import React, { useState } from 'react';
import axios from 'axios';

function CodeEditor({ questionId }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/compile', { questionId, code, language });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error compiling code:', error);
    }
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
      <button onClick={handleSubmit}>Run Tests</button>
      <h3>Results</h3>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <p>Input: {result.input}</p>
            <p>Expected Output: {result.expectedOutput}</p>
            <p>Actual Output: {result.actualOutput}</p>
            <p>Passed: {result.passed ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CodeEditor;