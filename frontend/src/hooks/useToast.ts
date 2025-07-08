import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState({
    open: false,
    title: '',
    description: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  const showToast = (title: string, description: string = '', type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ open: true, title, description, type });
  };

  const showSuccess = (message: string) => showToast(message, '', 'success');
  const showError = (message: string) => showToast(message, '', 'error');
  const showInfo = (message: string) => showToast(message, '', 'info');

  return {
    toast,
    setToast,
    showToast,
    showSuccess,
    showError,
    showInfo
  };
} 