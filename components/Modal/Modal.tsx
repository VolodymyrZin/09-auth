'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={event => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={css.closeButton}
        >
          Х
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
