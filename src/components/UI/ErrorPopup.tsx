import React, { useEffect } from 'react';
import styles from './ErrorPopup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes, faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export type PopupType = 'error' | 'warning' | 'info' | 'success';

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: PopupType;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'error',
  autoClose = false,
  autoCloseDelay = 5000,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      case 'success':
        return faCheckCircle;
      default:
        return faExclamationTriangle;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.popup} ${styles[type]}`}>
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        
        <div className={styles.header}>
          <FontAwesomeIcon icon={getIcon()} className={styles.icon} />
          <h3 className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.okButton} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup; 