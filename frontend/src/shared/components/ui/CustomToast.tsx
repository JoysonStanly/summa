import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import '../../../styles/CustomToast.css';


export type ToastType = 'success' | 'error' | 'info';

export interface CustomToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: ToastType;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, duration = 3000, onClose, type = 'success' }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }
    };

    requestAnimationFrame(updateProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return '#4aed88';
      case 'error':
        return '#ff4b4b';
      case 'info':
        return '#2196f3';
      default:
        return '#4aed88';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`custom-toast ${type}`}>
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={handleClose} aria-label="Close toast">
          <X size={14} />
        </button>
      </div>
      <div className="toast-progress-container">
        <div
          className="toast-progress-bar"
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressColor(),
          }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
// Named export for ToastType for compatibility
export { ToastType };
