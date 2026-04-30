import { useState, useCallback, useEffect, useRef } from 'react';
import './CardModal.css';
import ColorPicker from './ColorPicker';
import { validateCard, FOCUSABLE } from './utils';

const CardModal = ({ card, onSave, onDelete, onClose }) => {
  const [label, setLabel] = useState(card?.label || '');
  const [url, setUrl] = useState(card?.url || 'https://');
  const [bgColor, setBgColor] = useState(card?.bgColor || '#4a90e2');
  const [textColor, setTextColor] = useState(card?.textColor || '#ffffff');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const el = modalRef.current;
    if (!el) return;
    const first = el.querySelector(FOCUSABLE);
    if (first) first.focus();
    const handler = (e) => {
      if (e.key === 'Escape' && !error) onClose();
      if (e.key === 'Escape' && error) setError('');
      if (e.key !== 'Tab') return;
      const focusable = el.querySelectorAll(FOCUSABLE);
      if (!focusable.length) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, [error, onClose]);

  const handleSave = useCallback(() => {
    const result = validateCard({ label, url });
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError('');
    onSave({ id: card?.id, label: result.label, url: result.url, bgColor, textColor });
  }, [label, url, bgColor, textColor, card, onSave]);

  const handleLabelKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const next = modalRef.current.querySelectorAll(FOCUSABLE);
      const idx = Array.from(next).indexOf(e.target);
      if (idx >= 0 && idx < next.length - 1) {
        e.preventDefault();
        next[idx + 1].focus();
      }
    }
  }, []);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title">{card ? 'Edit card' : 'New card'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <label>
            Label
            <input type="text" value={label} onChange={e => { setLabel(e.target.value); setError(''); }} onKeyDown={handleLabelKeyDown} />
          </label>
          <label>
            URL
            <input type="text" value={url} onChange={e => { setUrl(e.target.value); setError(''); }} />
          </label>
          {error && <div className="modal-error" role="alert">{error}</div>}
          <div className="color-pickers">
            <div className="color-field">
                <span className="color-field-label">Background</span>
                <ColorPicker value={bgColor} onChange={setBgColor} />
            </div>
            <div className="color-field">
                <span className="color-field-label">Text</span>
                <ColorPicker value={textColor} onChange={setTextColor} />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          {card && <button className="danger" onClick={onDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default CardModal;
