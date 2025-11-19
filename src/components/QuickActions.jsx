import './QuickActions.css';

function QuickActions({ 
  technologies, 
  onUpdateAllStatuses, 
  onRandomSelect, 
  onExport,
  onReset 
}) {

  const markAllCompleted = () => {
    onUpdateAllStatuses('completed');
  };

  const resetAll = () => {
    onUpdateAllStatuses('not-started');
  };

  const getRandomInProgress = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      onRandomSelect(randomTech.id);
    } else {
      alert('🎉 Все технологии уже начаты или завершены!');
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
      alert('✅ Данные успешно экспортированы! Файл скачан на ваш компьютер.');
    }
  };

  const handleReset = () => {
    if (window.confirm('⚠️ Вы уверены, что хотите сбросить все данные к начальному состоянию? Это действие нельзя отменить.')) {
      if (onReset) {
        onReset();
        alert('✅ Все данные сброшены к начальному состоянию.');
      }
    }
  };

  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const totalCount = technologies.length;

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="action-buttons">
        <button onClick={markAllCompleted} className="action-btn completed" disabled={completedCount === totalCount}>
          ✅ Отметить все как выполненные
          {completedCount === totalCount && ' (все уже выполнены)'}
        </button>
        
        <button onClick={resetAll} className="action-btn reset" disabled={completedCount === 0}>
          🔄 Сбросить все статусы
          {completedCount === 0 && ' (нечего сбрасывать)'}
        </button>
        
        <button onClick={getRandomInProgress} className="action-btn random">
          🎲 Случайный выбор технологии
        </button>
        
        <button onClick={handleExport} className="action-btn export">
          📤 Экспорт данных
        </button>
        
        <button onClick={handleReset} className="action-btn danger">
          🗑️ Сбросить все данные
        </button>
      </div>
    </div>
  );
}

export default QuickActions;