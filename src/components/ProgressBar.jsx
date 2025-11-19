import './ProgressBar.css';

function ProgressBar({ 
  percentage = 0, 
  size = 'medium',
  color = 'primary',
  showLabel = true,
  labelPosition = 'inside',
  animated = true,
  striped = false
}) {
  // 🔥 Ограничиваем процент от 0 до 100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  
  // 🔥 Определяем стили в зависимости от props
  const progressBarClass = `progress-bar progress-${size} progress-${color} ${striped ? 'progress-striped' : ''} ${animated ? 'progress-animated' : ''}`;
  
  const progressFillStyle = {
    width: `${normalizedPercentage}%`
  };

  const getLabelText = () => {
    if (normalizedPercentage === 100) return '✅ Завершено';
    if (normalizedPercentage === 0) return '⏳ Не начато';
    return `${normalizedPercentage}%`;
  };

  return (
    <div className={progressBarClass}>
      <div 
        className="progress-fill"
        style={progressFillStyle}
        role="progressbar"
        aria-valuenow={normalizedPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {showLabel && labelPosition === 'inside' && normalizedPercentage > 10 && (
          <span className="progress-label-inside">
            {getLabelText()}
          </span>
        )}
      </div>
      
      {showLabel && labelPosition === 'outside' && (
        <div className="progress-label-outside">
          {getLabelText()}
        </div>
      )}
      
      {showLabel && labelPosition === 'inside' && normalizedPercentage <= 10 && (
        <div className="progress-label-outside">
          {getLabelText()}
        </div>
      )}
    </div>
  );
}

export default ProgressBar;