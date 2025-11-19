import ProgressBar from './ProgressBar';
import './ProgressHeader.css';

function ProgressHeader({ technologies, onExport, onImport }) {
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  const withNotes = technologies.filter(tech => tech.notes && tech.notes.length > 0).length;
  
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 🔥 Определяем цвет прогресс-бара в зависимости от прогресса
  const getProgressColor = () => {
    if (completionPercentage === 100) return 'success';
    if (completionPercentage >= 70) return 'primary';
    if (completionPercentage >= 30) return 'warning';
    return 'danger';
  };

  return (
    <div className="progress-header">
      <h2>📊 Статистика прогресса</h2>
      
      <div className="progress-main">
        <div className="progress-visual">
          <ProgressBar 
            percentage={completionPercentage}
            size="large"
            color={getProgressColor()}
            showLabel={true}
            labelPosition="outside"
            animated={true}
            striped={completionPercentage > 0 && completionPercentage < 100}
          />
        </div>
        
        <div className="progress-stats-grid">
          <div className="stat-card">
            <div className="stat-number total">{total}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number completed">{completed}</div>
            <div className="stat-label">Завершено</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number in-progress">{inProgress}</div>
            <div className="stat-label">В процессе</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number not-started">{notStarted}</div>
            <div className="stat-label">Не начато</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number notes">{withNotes}</div>
            <div className="stat-label">С заметками</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;