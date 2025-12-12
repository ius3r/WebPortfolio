import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import { ToastProvider, useToast } from '../context/ToastContext.jsx';

function render(ui) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  return {
    container,
    root,
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe('contexts', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('useAuth throws when used outside AuthProvider', () => {
    function Bad() {
      useAuth();
      return null;
    }

    expect(() => render(<Bad />)).toThrow(/useAuth must be used within an AuthProvider/);
  });

  it('useToast throws when used outside ToastProvider', () => {
    function Bad() {
      useToast();
      return null;
    }

    expect(() => render(<Bad />)).toThrow(/useToast must be used within a ToastProvider/);
  });

  it('ToastProvider shows toast and auto-removes after duration', () => {
    vi.useFakeTimers();

    function Child() {
      const { addToast } = useToast();
      return (
        <button
          onClick={() => addToast({ type: 'success', message: 'Saved!', duration: 50 })}
        >
          Add
        </button>
      );
    }

    const app = render(
      <ToastProvider>
        <Child />
      </ToastProvider>
    );

    const btn = app.container.querySelector('button');
    expect(btn).toBeTruthy();

    act(() => {
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(app.container.textContent).toContain('Saved!');

    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(app.container.textContent).not.toContain('Saved!');
    app.unmount();
  });

  it('ToastProvider keeps toast when duration is 0', () => {
    vi.useFakeTimers();

    function Child() {
      const { addToast } = useToast();
      return (
        <button onClick={() => addToast({ type: 'info', message: 'Sticky', duration: 0 })}>
          Add
        </button>
      );
    }

    const app = render(
      <ToastProvider>
        <Child />
      </ToastProvider>
    );

    const btn = app.container.querySelector('button');
    act(() => {
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(app.container.textContent).toContain('Sticky');
    app.unmount();
  });
});
