import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import '../styles/TopicDetail.css';

function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userID = localStorage.getItem('user_id');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const loadTopic = useCallback(async () => {
    try {
      const res = await authFetch(`http://localhost:8081/api/forum/topics/${id}`);
      const data = await res.json();
      setTopic(data.topic);
    } catch (error) {
      console.error('Ошибка загрузки темы', error);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    try {
      const res = await authFetch(`http://localhost:8081/api/forum/topics/${id}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Ошибка загрузки комментариев', error);
    }
  }, [id]);

  useEffect(() => {
    loadTopic();
    loadComments();
  }, [loadTopic, loadComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`http://localhost:8081/api/forum/topics/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        loadComments();
      } else {
        const errText = await res.text();
        console.error('Ошибка добавления комментария:', errText);
      }
    } catch (error) {
      console.error('Ошибка отправки комментария', error);
    }
  };

  const handleDeleteComment = async (topicID, commentID) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот комментарий?');
    if (!confirmed) return;

    try {
      const response = await authFetch(`http://localhost:8081/api/forum/topics/${topicID}/comments/${commentID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при удалении комментария:', errorText);
        alert('Не удалось удалить комментарий. Проверьте права доступа или попробуйте позже.');
        return;
      }

      setComments(prev => prev.filter(comment => comment.ID !== commentID));
    } catch (error) {
      console.error('Сетевая ошибка при удалении комментария:', error);
      alert('Произошла ошибка сети. Пожалуйста, попробуйте позже.');
    }
  };

  const handleBackToList = () => {
    navigate('/topics');
  };

  if (!topic) return <p className="loading">Загрузка...</p>;

  return (
    <div className="topic-detail-container">
      <div className="topic-content-wrapper">
        <button onClick={handleBackToList} className="back-button">
          <i className="fa fa-arrow-left"></i>
        </button>

        <div className="topic-main-content">
          <div className="topic-main">
            <h2>{topic.Title}</h2>
            <p>{topic.Content}</p>
            <span className="topic-date">Автор: {topic.UserEmail || 'неизвестен'}</span>
            <span className="topic-date">
              {new Date(topic.CreatedAt).toLocaleString()}
            </span>
          </div>

          <div className="comments-section">
            <h3>Комментарии</h3>
            {comments.length === 0 ? (
              <p>Комментариев пока нет.</p>
            ) : (
              comments.map(comment => (
                <div key={comment.ID} className="comment-item comment-flex">
                  <div>
                    <p>{comment.Content}</p>
                    <span className="comment-date">Автор: {comment.UserEmail + " " || 'неизвестен'}</span>
                    <span className="comment-date">{new Date(comment.CreatedAt).toLocaleString()}</span>
                  </div>
                  {isAuthenticated && (comment.UserID === Number(userID) || isAdmin) && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteComment(topic.ID, comment.ID)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))
            )}

            {isAuthenticated && (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Напишите комментарий..."
                  rows={3}
                  required
                />
                <button type="submit">Отправить</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicDetail;
