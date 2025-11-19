import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTechnologies } from '../hooks/useTechnologies';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { id } = useParams();
  const { technologies, updateTechnologyStatus, updateTechnologyNotes } = useTechnologies();
  const [technology, setTechnology] = useState(null);

  // 🔥 Синхронизируем технологию с состоянием и localStorage
  useEffect(() => {
    const techFromState = technologies.find(tech => tech.id === parseInt(id));

    if (techFromState) {
      setTechnology(techFromState);
      return;
    }

    const saved =
      localStorage.getItem('technologies') || localStorage.getItem('techTrackerData');

    if (saved) {
      const parsed = JSON.parse(saved);
      const techFromStorage = parsed.find(tech => tech.id === parseInt(id));
      setTechnology(techFromStorage || null);
    } else {
      setTechnology(null);
    }
  }, [id, technologies]);

  // 🔥 Если технология не найдена
  if (!technology) {
    return (
      <div className="page technology-detail-page">
        <div className="not-found">
          <h1>🔍 Технология не найдена</h1>
          <p>Технология с ID {id} не существует.</p>
          <Link to="/technologies" className="btn btn-primary">
            ← Назад к списку технологий
          </Link>
        </div>
      </div>
    );
  }

  // 🔥 Функция изменения статуса
  const handleStatusChange = (newStatus) => {
    if (!technology) return;
    updateTechnologyStatus(technology.id, newStatus);
    setTechnology(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  // 🔥 Функция изменения заметок
  const handleNotesChange = (newNotes) => {
    if (!technology) return;
    updateTechnologyNotes(technology.id, newNotes);
    setTechnology(prev => prev ? { ...prev, notes: newNotes } : prev);
  };

  // 🔥 Текст статуса на русском
  const getStatusText = (status) => {
    const statusMap = {
      'not-started': '⏳ Не начато',
      'in-progress': '🔄 В процессе',
      'completed': '✅ Завершено'
    };
    return statusMap[status] || status;
  };

  // 🔥 Следующий статус
  const getNextStatus = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  return (
    <div className="page technology-detail-page">
      {/* 🔥 Хлебные крошки */}
      <nav className="breadcrumbs">
        <Link to="/">Главная</Link>
        <span> / </span>
        <Link to="/technologies">Технологии</Link>
        <span> / </span>
        <span>{technology.title}</span>
      </nav>

      <div className="technology-detail">
        {/* 🔥 Заголовок и действия */}
        <div className="detail-header">
          <div className="header-content">
            <h1>{technology.title}</h1>
            <div className="status-badge-large">
              {getStatusText(technology.status)}
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={() => handleStatusChange(getNextStatus())}
              className="btn btn-primary"
            >
              🔄 Сменить статус
            </button>
            <Link to="/technologies" className="btn btn-secondary">
              ← Назад
            </Link>
          </div>
        </div>

        {/* 🔥 Основная информация */}
        <div className="detail-content">
          <div className="info-section">
            <h2>📖 Описание</h2>
            <p className="description">{technology.description}</p>
          </div>

          {/* 🔥 Статус и прогресс */}
          <div className="status-section">
            <h2>📊 Статус изучения</h2>
            <div className="status-actions">
              <button 
                onClick={() => handleStatusChange('not-started')}
                className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
              >
                ⏳ Не начато
              </button>
              <button 
                onClick={() => handleStatusChange('in-progress')}
                className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
              >
                🔄 В процессе
              </button>
              <button 
                onClick={() => handleStatusChange('completed')}
                className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
              >
                ✅ Завершено
              </button>
            </div>
          </div>

          {/* 🔥 Заметки */}
          <div className="notes-section">
            <h2>📝 Мои заметки</h2>
            <textarea
              value={technology.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Добавьте ваши заметки по изучению этой технологии..."
              rows="6"
              className="notes-textarea"
            />
            <div className="notes-hint">
              {technology.notes ? `💾 Сохранено (${technology.notes.length} символов)` : '✏️ Начните вводить заметки...'}
            </div>
          </div>

          {/* 🔥 Мета-информация */}
          <div className="meta-section">
            <h2>ℹ️ Информация</h2>
            <div className="meta-grid">
              <div className="meta-item">
                <strong>ID:</strong>
                <span>{technology.id}</span>
              </div>
              <div className="meta-item">
                <strong>Статус:</strong>
                <span className={`status-text ${technology.status}`}>
                  {getStatusText(technology.status)}
                </span>
              </div>
              <div className="meta-item">
                <strong>Заметки:</strong>
                <span>{technology.notes ? `${technology.notes.length} символов` : 'Нет'}</span>
              </div>
              <div className="meta-item">
                <strong>Создано:</strong>
                <span>Системой</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Действия внизу */}
        <div className="detail-actions">
          <Link to="/technologies" className="btn btn-secondary">
            ← Назад к списку
          </Link>
          <button 
            onClick={() => handleStatusChange(getNextStatus())}
            className="btn btn-primary"
          >
            🔄 Следующий статус
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;