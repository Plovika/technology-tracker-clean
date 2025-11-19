import { useState, useEffect } from 'react';
import './UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 ЛОКАЛЬНЫЕ ДАННЫЕ - мгновенная загрузка
    const userData = {
      id: 1,
      name: 'Алексей React-Студент',
      email: 'student@react-learning.ru',
      phone: '+7 (999) 123-45-67',
      website: 'react-tracker-demo.ru',
      company: {
        name: 'React Education Center',
        catchPhrase: 'Практика - путь к мастерству!'
      },
      address: {
        city: 'Москва',
        street: 'Улица Программистов'
      }
    };

    // Короткая имитация загрузки для красоты
    const timer = setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="user-profile loading">
        <div className="loading-spinner"></div>
        <p>Загрузка профиля...</p>
        <small>Используются локальные данные</small>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h2>👤 Профиль студента</h2>
      
      <div className="api-status success">
        ✅ Используются локальные данные
      </div>
      
      <div className="user-info">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Телефон:</strong> {user.phone}</p>
        <p><strong>Сайт:</strong> {user.website}</p>
        <p><strong>Учебное заведение:</strong> {user.company.name}</p>
        <p><strong>Девиз:</strong> "{user.company.catchPhrase}"</p>
        <p><strong>Город:</strong> {user.address.city}</p>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '15px', fontSize: '12px', color: '#666'}}>
        💡 Это демо-профиль. В реальном приложении здесь были бы ваши данные.
      </div>
    </div>
  );
}

export default UserProfile;