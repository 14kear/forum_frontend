// Проверяет авторизацию пользователя
// Если пользователь авторизован - показывает защищенный контент
// Если нет - перенаправляет на страницу входа

import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Очищаем на случай, если остались старые данные
    localStorage.removeItem('isAuthenticated');
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;