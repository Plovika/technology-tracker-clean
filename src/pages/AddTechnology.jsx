import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTechnologies } from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // 🔥 Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание технологии обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 🔥 Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🔥 Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 🔥 Создаем новую технологию
    const newTechnology = {
      id: Date.now(), // 🔥 Простой ID на основе времени
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      notes: formData.notes.trim()
    };

    // 🔥 Добавляем в массив технологий
    const updatedTechnologies = [...technologies, newTechnology];
    setTechnologies(updatedTechnologies);

    // 🔥 Показываем уведомление и перенаправляем
    alert('✅ Технология успешно добавлена!');
    navigate('/technologies');
  };

  // 🔥 Сброс формы
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      status: 'not-started',
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="page add-technology-page">
      {/* 🔥 Хлебные крошки */}
      <nav className="breadcrumbs">
        <Link to="/">Главная</Link>
        <span> / </span>
        <Link to="/technologies">Технологии</Link>
        <span> / </span>
        <span>Добавить технологию</span>
      </nav>

      <div className="add-technology-form">
        <div className="form-header">
          <h1>➕ Добавить новую технологию</h1>
          <p>Заполните информацию о технологии для отслеживания прогресса</p>
        </div>

        <form onSubmit={handleSubmit} className="technology-form">
          {/* 🔥 Название технологии */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              📝 Название технологии *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Например: React Hooks, Node.js Express, MongoDB..."
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* 🔥 Описание */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              📖 Описание технологии *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Опишите, что представляет собой эта технология, для чего используется..."
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* 🔥 Статус */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              📊 Начальный статус
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="not-started">⏳ Не начато</option>
              <option value="in-progress">🔄 В процессе</option>
              <option value="completed">✅ Завершено</option>
            </select>
            <div className="form-hint">
              Выберите начальный статус изучения технологии
            </div>
          </div>

          {/* 🔥 Заметки */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              💡 Начальные заметки
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Добавьте начальные заметки, идеи, ссылки на ресурсы..."
            />
            <div className="form-hint">
              Необязательное поле. Можно добавить позже
            </div>
          </div>

          {/* 🔥 Действия формы */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              🗑️ Очистить форму
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/technologies')}
              className="btn btn-outline"
            >
              ← Отмена
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
            >
              ✅ Добавить технологию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTechnology;