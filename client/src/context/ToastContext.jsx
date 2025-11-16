import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', message = '' , duration = 3000 }) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
  }, [remove]);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      zIndex: 1000,
      right: 16,
      bottom: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none'
    }} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} onClose={() => onClose(t.id)}>
          {t.message}
        </Toast>
      ))}
    </div>
  );
}

function Toast({ type, children, onClose }) {
  const colors = {
    success: { bg: '#e6ffed', border: '#2ecc71', text: '#1c7d43' },
    error:   { bg: '#ffecec', border: '#e74c3c', text: '#8e2b22' },
    info:    { bg: '#eef6ff', border: '#3498db', text: '#1b5e83' },
    warning: { bg: '#fff8e1', border: '#f39c12', text: '#7a4f00' }
  };
  const c = colors[type] || colors.info;
  return (
    <div role="status" style={{
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      boxShadow: '0 6px 24px rgba(0,0,0,.12)',
      borderRadius: 8,
      padding: '10px 12px',
      minWidth: 240,
      maxWidth: 380,
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>
      <span style={{ flex: 1 }}>{children}</span>
      <button onClick={onClose} aria-label="Dismiss" style={{
        border: 'none',
        background: 'transparent',
        color: c.text,
        cursor: 'pointer',
        fontSize: 16,
        lineHeight: 1,
        padding: 4
      }}>×</button>
    </div>
  );
}
