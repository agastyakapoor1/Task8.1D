import React, { useContext, useState, useEffect } from 'react';
import { QuestionsContext } from '../contexts/QuestionsContext';
import NavBar from './NavBar';
import './QuestionPage.css';
import firebase from '../firebase';

const formatDate = (timestamp) => {
  if (timestamp?.seconds) {
    const date = new Date(timestamp.seconds * 1000); 
    return date.toLocaleDateString(); 
  }
  return 'Unknown Date'; 
};

const QuestionPage = () => {
  const { questions, fetchQuestions } = useContext(QuestionsContext);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Toggle to expand/collapse a question
  const toggleExpand = (id) => {
    setExpandedQuestion((prev) => (prev === id ? null : id));
  };

  // Filter questions based on title, tag, and date
  const filteredQuestions = questions.filter((question) => {
    // Filter by Title (case insensitive)
    const titleMatch = filterTitle
      ? question.title.toLowerCase().includes(filterTitle.toLowerCase())
      : true;

    // Filter by Tag
    const tagMatch = filterTag
      ? question.tags?.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase()))
      : true;

    // Filter by Date
    const dateMatch = filterDate
      ? formatDate(question.timestamp) === filterDate
      : true;

    return titleMatch && tagMatch && dateMatch;
  });

  return (
    <>
      <NavBar />
      <div className="container">
        <h2 className="question-heading">Find a Question</h2>

        <div className="filter-section">
          <input
            type="text"
            placeholder="Filter by Tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Title"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
          <input
            type="date"
            placeholder="Filter by Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {/* Display active filters only when at least one filter is applied */}
        {(filterDate || filterTag || filterTitle) && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            {filterDate && <span>Date: {filterDate}</span>}
            {filterTag && <span>Tag: {filterTag}</span>}
            {filterTitle && <span>Title: {filterTitle}</span>}
          </div>
        )}

        <div className="question-list">
          {filteredQuestions.length === 0 ? (
            <p>No questions match your search criteria.</p>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} className="card-content">
                <div className="card-header">{question.title}</div>
                <div className="card-meta">{formatDate(question.createdAt)}</div>
                <div className="card-description">{question.description}</div>

                {expandedQuestion === question.id && (
                  <div className="card-details">
                    <p>Tags: {Array.isArray(question.tags) ? question.tags.join(', ') : 'No tags'}</p>
                    <p>More details about the question...</p>
                  </div>
                )}

                <button className="show-more-btn" onClick={() => toggleExpand(question.id)}>
                  {expandedQuestion === question.id ? 'Show Less' : 'Show More'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionPage;
