import React, { useState, useEffect } from 'react';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    answers: [],
    correctIndex: 0,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions((prevQuestions) => [...prevQuestions, data]);
        setNewQuestion({
          prompt: '',
          answers: [],
          correctIndex: 0,
        });
      } else {
        console.error('Error creating question:', response.status);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleCorrectIndexChange = async (questionId, newCorrectIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correctIndex: newCorrectIndex,
        }),
      });

      if (response.ok) {
        // If the PATCH request is successful, update the question list in state
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === questionId
              ? { ...question, correctIndex: newCorrectIndex }
              : question
          )
        );
      } else {
        console.error('Error updating correct index:', response.status);
      }
    } catch (error) {
      console.error('Error updating correct index:', error);
    }
  };

  return (
    <div>
      <h2>Questions</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.text} - Correct Index: {question.correctIndex}
            <br />
            <label>
              Change Correct Index:
              <select
                value={question.correctIndex}
                onChange={(e) =>
                  handleCorrectIndexChange(question.id, parseInt(e.target.value, 10))
                }
              >
                {question.answers.map((answer, index) => (
                  <option key={index} value={index}>
                    {answer}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>

      <h2>New Question</h2>
      <form onSubmit={handleFormSubmit}>
        {/* form input fields for creating a new question) */}
        <h2>New Question</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={newQuestion.prompt}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Answers (comma-separated):
          <input
            type="text"
            name="answers"
            value={newQuestion.answers.join(',')}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Correct Index:
          <input
            type="number"
            name="correctIndex"
            value={newQuestion.correctIndex}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      </form>
    </div>
  );
};

export default QuestionList;
