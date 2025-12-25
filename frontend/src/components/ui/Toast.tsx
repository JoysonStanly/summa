import { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number; // ms
}

const colors: Record<ToastVariant, string> = {
  success: 'bg-emerald-600',
  error: 'bg-rose-600',
  info: 'bg-sky-600',
  warning: 'bg-amber-600',
};

function Toast({ message, variant = 'info', onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [onClose, duration]);

  return (
    <div className={`pointer-events-auto shadow-lg rounded-md px-3 py-2 text-sm text-white ${colors[variant]}`}>
      {message}
    </div>
  );
}

export { Toast };
export default Toast;
