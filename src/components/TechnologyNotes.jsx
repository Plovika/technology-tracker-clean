import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
  // 🔥 Останавливаем всплытие при клике на textarea
  const handleTextareaClick = (e) => {
    e.stopPropagation();
  };

  const handleChange = (e) => {
    onNotesChange(techId, e.target.value);
  };

  return (
    <div className="notes-section">
      <h4>📝 Мои заметки:</h4>
      <textarea
        value={notes}
        onChange={handleChange}
        onClick={handleTextareaClick} // 🔥 Добавляем обработчик клика
        placeholder="Записывайте сюда важные моменты, идеи, ссылки..."
        rows="3"
        className="notes-textarea"
      />
      <div className="notes-hint">
        {notes.length > 0 
          ? `💾 заметка сохранена (${notes.length} символов)` 
          : '✏️ Добавьте заметку...'
        }
      </div>
    </div>
  );
}

export default TechnologyNotes;