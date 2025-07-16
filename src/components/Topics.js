import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import '../styles/Topics.css';

function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userID = localStorage.getItem('user_id');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const res = await authFetch("http://localhost:8081/api/forum/topics");

      if (res.status === 204) {
        setTopics([]);
      } else {
        const data = await res.json();
        if (Array.isArray(data.topics)) {
          setTopics(data.topics);
        } else {
          throw new Error("Неверный формат данных");
        }
      }
    } catch (err) {
      setError("Ошибка загрузки тем");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setTitle('');
    setContent('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch('http://localhost:8081/api/forum/topics', {
        method: 'POST',
        body: JSON.stringify({ title, content })
      });

      if (res.ok) {
        closeModal();
        loadTopics();
      } else {
        console.error('Ошибка создания темы');
      }
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  };

  const handleDeleteTopic = async (topicID) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту тему?');
    if (!confirmed) return;
  
    try {
      const response = await authFetch(`http://localhost:8081/api/forum/topics/${topicID}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при удалении темы:', errorText);
        alert('Не удалось удалить тему. Возможно, у вас нет прав или произошла ошибка сервера.');
        return;
      }
  
      setTopics(prevTopics => prevTopics.filter(topic => topic.ID !== topicID));
    } catch (error) {
      console.error('Сетевая ошибка при удалении темы:', error);
      alert('Произошла ошибка сети. Пожалуйста, попробуйте позже.');
    }
  };
  
  

  return (
    <div className="topics-container">
      <h1>Темы форума</h1>
      {isAuthenticated && (
        <div className="create-button-wrapper">
          <button className="create-button" onClick={openModal}>Создать тему</button>
        </div>
      )}

      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : topics.length > 0 ? (
        <ul className="topics-list">
          {topics.map(topic => (
          <li key={topic.ID} className="topic-item">
            <Link to={`/topics/${topic.ID}`} className="topic-link">
              <h3 className="topic-title">{topic.Title}</h3>
              <p className="topic-content-preview">{topic.Content}</p>
              <div className="topic-meta">
                <span className="topic-date">Автор: {topic.UserEmail || 'неизвестен'}</span>
                <span className='topic-date'>{new Date(topic.CreatedAt).toLocaleString()}</span>
              </div>
            </Link>
            {isAuthenticated && (topic.UserID === Number(userID) || isAdmin) && (
              <button className="delete-button" onClick={() => handleDeleteTopic(topic.ID)}>
                Удалить
              </button>
            )}
  </li>
))}
        </ul>
      ) : (
        <p>Тем пока нет.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Создать тему</h2>
            <form onSubmit={handleCreateTopic}>
              <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                rows="5"
                placeholder="Содержание"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Создать</button>
                <button type="button" onClick={closeModal}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;
