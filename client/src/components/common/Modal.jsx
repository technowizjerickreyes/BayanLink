import { useEffect, useRef, cloneElement } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md',
  className = '',
  backdropClassName = ''
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={backdropRef}
      className={`fixed inset-0 z-[9999] grid place-items-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} animate-in fade-in zoom-in duration-200
          min-h-[20rem] overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl
          shadow-2xl shadow-slate-900/10 border border-slate-200/50
          dark:bg-slate-800/95 dark:border-slate-700/50
          ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 pb-4 md:p-8 md:pb-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 border-t border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm md:flex md:justify-end dark:border-slate-700/50 dark:bg-slate-800/90">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export default Modal;

