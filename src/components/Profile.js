import React from 'react';

function Profile() {
  return (
    <div className="profile">
      <h1>Профиль</h1>
      <p>Это страница вашего профиля. Она доступна только авторизованным пользователям.</p>
      <p className='joke'>Здесь могла бы быть информация о вашем профиле, но её нет)))</p>
    </div>
  );
}

export default Profile;