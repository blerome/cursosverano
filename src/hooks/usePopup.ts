import { useState, useCallback } from 'react';
import { PopupType } from '../components/UI/ErrorPopup';

interface PopupState {
  isOpen: boolean;
  title: string;
  message: string;
  type: PopupType;
}

interface UsePopupReturn {
  popup: PopupState;
  showPopup: (title: string, message: string, type?: PopupType) => void;
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  hidePopup: () => void;
}

export const usePopup = (): UsePopupReturn => {
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showPopup = useCallback((title: string, message: string, type: PopupType = 'info') => {
    setPopup({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  const showError = useCallback((title: string, message: string) => {
    showPopup(title, message, 'error');
  }, [showPopup]);

  const showSuccess = useCallback((title: string, message: string) => {
    showPopup(title, message, 'success');
  }, [showPopup]);

  const showWarning = useCallback((title: string, message: string) => {
    showPopup(title, message, 'warning');
  }, [showPopup]);

  const showInfo = useCallback((title: string, message: string) => {
    showPopup(title, message, 'info');
  }, [showPopup]);

  const hidePopup = useCallback(() => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    popup,
    showPopup,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hidePopup,
  };
}; 