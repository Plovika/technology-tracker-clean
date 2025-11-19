import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
  const handleCardClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(id, nextStatus);
  };

  // 🔥 Останавливаем всплытие события при клике на заметки
  const handleNotesClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие клика к карточке
  };

  return (
    <div 
      id={`tech-${id}`}
      className={`technology-card status-${status}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">{getStatusText(status)}</span>
      </div>
      
      <p className="card-description">{description}</p>
      
      {/* 🔥 Добавляем обработчик клика для остановки всплытия */}
      <div onClick={handleNotesClick}>
        <TechnologyNotes 
          notes={notes}
          onNotesChange={onNotesChange}
          techId={id}
        />
      </div>
      
      <div className="card-footer">
        <span className="click-hint">🖱️ Кликните на карточку для изменения статуса</span>
      </div>
    </div>
  );
}

function getStatusText(status) {
  const statusMap = {
    'not-started': '⏳ Не начато',
    'in-progress': '🔄 В процессе', 
    'completed': '✅ Завершено'
  };
  return statusMap[status] || status;
}

export default TechnologyCard;