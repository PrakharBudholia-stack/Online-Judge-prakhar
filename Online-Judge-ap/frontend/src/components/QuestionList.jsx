import React, { useEffect, useState } from 'react';
import axios from 'axios';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('QuestionList.jsx: Fetching questions');
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
        console.log('QuestionList.jsx: Questions fetched successfully', response.data);
      } catch (error) {
        console.error('QuestionList.jsx: Error fetching questions', error);
        setError('Error fetching questions');
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>{question.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;