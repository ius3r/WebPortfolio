import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

import AdminModal from '../components/AdminModal.jsx';

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

describe('AdminModal', () => {
  it('calls onClose when clicking backdrop', () => {
    const onClose = vi.fn();
    const app = render(
      <AdminModal title="T" onClose={onClose}>
        <div>Body</div>
      </AdminModal>
    );

    const backdrop = app.container.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();

    act(() => {
      backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    app.unmount();
  });

  it('does NOT call onClose when clicking inside modal content', () => {
    const onClose = vi.fn();
    const app = render(
      <AdminModal title="T" onClose={onClose}>
        <div>Body</div>
      </AdminModal>
    );

    const modal = app.container.querySelector('.modal');
    expect(modal).toBeTruthy();

    act(() => {
      modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledTimes(0);
    app.unmount();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    const app = render(
      <AdminModal title="T" onClose={onClose}>
        <div>Body</div>
      </AdminModal>
    );

    const closeBtn = app.container.querySelector('button[aria-label="Close"]');
    expect(closeBtn).toBeTruthy();

    act(() => {
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    app.unmount();
  });
});
