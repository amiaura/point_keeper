'use client';

import { ReactNode } from 'react';

type WinnerModalProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onClose: () => void;
  onAction: () => void;
};

export default function WinnerModal({
  title = '🎉 Game Over',
  message,
  actionLabel = 'New Game',
  onClose,
  onAction,
}: WinnerModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onAction} className="button-primary">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
