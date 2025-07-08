import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Header } from './components/Header/Header';
import { Box } from '@mui/material';
import { useAuth } from './auth/useAuth';
import { useLocation } from 'react-router-dom';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!hideHeader && isAuthenticated && <Header />}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppRoutes />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
