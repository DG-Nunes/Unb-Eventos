import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export function ToastComponent({ open, onOpenChange, title, description, type = 'info' }: ToastProps) {
  const getSeverity = (): AlertColor => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={getSeverity()}
        sx={{ width: '100%' }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.25rem' }}>
              {description}
            </div>
          )}
        </div>
      </Alert>
    </Snackbar>
  );
} 