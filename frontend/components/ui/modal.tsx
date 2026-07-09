'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    if (open) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0d0f12]/95 p-6 text-white shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {(title || description) && (
          <header className="mb-5 space-y-2">
            {title ? (
              <h2
                id="modal-title"
                className="text-xl font-semibold tracking-tight"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id="modal-description"
                className="max-w-xl text-sm text-zinc-400"
              >
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
