import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#133366',
      light: '#1e4a8a',
      dark: '#0f2444',
    },
    secondary: {
      main: '#16713c',
      light: '#1a8a4a',
      dark: '#115c30',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#2563eb',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fafafa',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#133366',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#16713c',
            '&:hover': {
              backgroundColor: '#115c30',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorSuccess: {
          backgroundColor: '#16a34a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#15803d',
          },
        },
        colorWarning: {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#d97706',
          },
        },
        colorInfo: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
        colorError: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#b91c1c',
          },
        },
        colorPrimary: {
          backgroundColor: '#133366',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0f2444',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
}); 