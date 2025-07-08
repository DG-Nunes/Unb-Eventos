import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useAuth } from '../../auth/useAuth';

export default function Login() {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setLoading(true);
    try {
      await login(formLogin.email, formLogin.password);
      // O redirecionamento será feito automaticamente pelo AuthProvider
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f7f3f3',
        '@media (max-width: 900px)': {
          flexDirection: 'column',
        },
      }}
    >
      {/* Left Side - Form */}
      <Box
        sx={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem 2rem 2rem 0',
          minWidth: '340px',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'transparent',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#133366',
                marginBottom: 3,
                letterSpacing: 1,
              }}
            >
              UNB EVENTOS
            </Typography>
            
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, marginBottom: 0.5 }}>
              Entrar
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
              Preencha seus dados
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                type="email"
                placeholder="Email"
                value={formLogin.email}
                onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                type="password"
                placeholder="Senha"
                value={formLogin.password}
                onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  padding: '0.9rem 0',
                  background: '#16713c',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '2rem',
                  marginTop: 0.5,
                  marginBottom: 1.5,
                  '&:hover': {
                    background: '#115c30',
                  },
                }}
              >
                {loading ? 'Entrando...' : 'ENTRAR'}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ marginTop: 0.5, textAlign: 'center' }}>
              Ainda não tem conta?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#133366',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  p: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Criar Conta
              </Button>
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Right Side - Image */}
      <Box
        sx={{
          flex: 1,
          background: '#222',
          backgroundImage: 'url(/src/assets/login-image-default.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
        }}
      />
    </Box>
  );
}
