import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/Chat.css';

// Функция для генерации уникального цвета на основе строки
const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const retryCount = useRef(0);
  const isMounted = useRef(false);

  // Функция для подключения WebSocket
  const connectWebSocket = useCallback(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuth(authStatus);

    if (!authStatus) return;

    const accessToken = localStorage.getItem('access_token');
    const wsUrl = `ws://localhost:8081/api/forum/ws/chat?accessToken=${encodeURIComponent(accessToken)}`;

    setWsStatus('connecting');
    ws.current = new WebSocket(wsUrl);

    // Установление WebSocket-соединения
    ws.current.onopen = () => {
      retryCount.current = 0;
      setWsStatus('connected');
      console.log('WebSocket connected');
    };

    // Получение сообщений через WebSocket
    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error === 'unauthorized') {
          const refreshToken = localStorage.getItem('refresh_token');
          const appID = 1;
          if (!refreshToken){
            handleUnauthorized();
            return;
          }

          try{
            const response = await fetch('http://localhost:8080/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({refresh_token: refreshToken, app_id: appID})
            })

            if (response.ok){
              const data = await response.json();
              localStorage.setItem('access_token', data.accessToken);
              localStorage.setItem('refresh_token', data.refreshToken);

              // Переподключаем WebSocket с новым токеном
              connectWebSocket(); 
            }else{
              //handleUnauthorized();
              return;
            }
          } catch (err){
            console.error('Ошибка обновления токенов:', err);
            handleUnauthorized();
            return;
          }
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    };

    const handleUnauthorized = () => {
      setIsAuth(false);
      localStorage.clear();
      ws.current?.close();
      window.location.href = '/login';
};

    // Закрытие соединения
    ws.current.onclose = (event) => {
      setWsStatus('disconnected');
      console.log(`WebSocket closed: ${event.reason}`);

      if (!isMounted.current) return;

      // Экспоненциальная задержка для переподключения
      const delay = Math.min(5000 * (retryCount.current + 1), 30000);
      retryCount.current += 1;
      setTimeout(() => {
        if (isMounted.current) connectWebSocket();
      }, delay);
    };

    // Ошибки WebSocket-соединения
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('error');
    };
  }, []);

  // Загрузка истории сообщений
  useEffect(() => {
    isMounted.current = true;

    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/forum/ws/chat/messages');
        const data = await response.json();
        // Сортировка сообщений, чтобы новые были снизу
        setMessages(data.reverse());
      } catch (err) {
        console.error('Ошибка загрузки истории сообщений:', err);
      }
    };

    fetchMessages();
    connectWebSocket();

    // Очистка при размонтировании компонента
    return () => {
      isMounted.current = false;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [connectWebSocket]); // добавляем connectWebSocket в зависимости

  // Прокрутка сообщений внизу
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuth && wsStatus === 'connected' && content.trim()) {
      try {
        ws.current.send(JSON.stringify({ content }));
        setContent('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Общий чат
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const userColor = generateColor(msg.userEmail || msg.userID || 'anonymous');
          return (
            <div key={index} className="chat-message">
              <span className="message-email" style={{ color: userColor }}>
                {msg.userEmail || 'Аноним'}
              </span>:
              <span className="message-content">{msg.content}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {isAuth ? (
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={wsStatus !== 'connected'}
            required
          />
          <button type="submit" disabled={wsStatus !== 'connected' || !content.trim()}>
            {wsStatus === 'connected' ? 'Отправить' : 'Ожидание соединения...'}
          </button>
        </form>
      ) : (
        <div className="chat-auth-warning">
          Чтобы писать в чат, <a href="/login">войдите</a> или <a href="/register">зарегистрируйтесь</a>
        </div>
      )}
    </div>
  );
};

export default Chat;
