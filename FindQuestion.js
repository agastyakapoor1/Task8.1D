import React, { useEffect, useState } from 'react';
import { fetchQuestions } from '../firebase'; // Assuming this function fetches the questions from your database
import Draggable from 'react-draggable';
import './FindQuestion.css';

function FindQuestion() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filter, setFilter] = useState({
    date: '',
    tag: '',
    title: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions(setQuestions)
      .finally(() => setLoading(false));  // Set loading to false once data is fetched
  }, []);

  // Update filtered questions when the list of questions changes
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter, [name]: value };

      let filtered = questions;
      if (newFilter.date) {
        filtered = filtered.filter(question =>
          new Date(question.date.seconds * 1000).toLocaleDateString().includes(newFilter.date)
        );
      }
      if (newFilter.tag) {
        filtered = filtered.filter(question => question.tags.includes(newFilter.tag));
      }
      if (newFilter.title) {
        filtered = filtered.filter(question =>
          question.title.toLowerCase().includes(newFilter.title.toLowerCase())
        );
      }
      setFilteredQuestions(filtered);
      return newFilter;
    });
  };

  // Toggle details of a question
  const toggleDetails = (id) => {
    setQuestions(questions.map(question => {
      if (question.id === id) {
        return { ...question, expanded: !question.expanded };
      }
      return question;
    }));
  };

  return (
    <div className="find-question">
      <h1>Find Question</h1>

      {/* Filter Section */}
      <div className="filters">
        <input
          type="text"
          name="date"
          placeholder="Filter by date"
          value={filter.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="tag"
          placeholder="Filter by tag"
          value={filter.tag}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          value={filter.title}
          onChange={handleFilterChange}
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading questions...</p>}

      {/* No Results Message */}
      {filteredQuestions.length === 0 && !loading && (
        <p>No questions found matching your criteria.</p>
      )}

      {/* List of Questions */}
      <div className="question-list">
        {filteredQuestions.map((question) => (
          <Draggable key={question.id}>
            <div className="question-card">
              <h2>{question.title}</h2>
              <button onClick={() => toggleDetails(question.id)}>Details</button>
              {question.expanded && (
                <div className="question-details">
                  <p>{question.description}</p>
                  <p>Tags: {question.tags.join(', ')}</p>
                  <p>Date: {new Date(question.date.seconds * 1000).toLocaleDateString()}</p>
                  <p>{question.abstract}</p>
                  <p>{question.articleText}</p>
                  {question.imageUrl && <img src={question.imageUrl} alt={question.title} />}
                </div>
              )}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default FindQuestion;
