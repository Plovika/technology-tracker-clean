import { useEffect } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children, size = 'medium', closeOnOverlayClick = true }) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    // 🔥 Добавляем обработчик Escape при монтировании
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
        >
            <div className={`modal-content modal-${size}`}>
                {/* 🔥 Заголовок модалки */}
                {(title || onClose) && (
                    <div className="modal-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {onClose && (
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Закрыть модальное окно"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

                {/*  Содержимое модалки */}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;