import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CodeEditor from './CodeEditor.jsx';

function QuestionDetail({ match }) {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log(`QuestionDetail.jsx: Fetching question with id ${match.params.id}`);
        const response = await axios.get(`/api/questions/${match.params.id}`);
        setQuestion(response.data);
        console.log('QuestionDetail.jsx: Question fetched successfully', response.data);
      } catch (error) {
        console.error('QuestionDetail.jsx: Error fetching question', error);
        setError('Error fetching question');
      }
    };

    fetchQuestion();
  }, [match.params.id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{question.title}</h1>
      <p>{question.description}</p>
      <CodeEditor questionId={question._id} />
    </div>
  );
}

export default QuestionDetail;