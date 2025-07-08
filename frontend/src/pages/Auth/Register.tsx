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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../auth/useAuth';
import utils from '../../utils';
import { UserRole } from '../../types/event';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmPassword: '',
    papel: UserRole.PARTICIPANT,
    matricula: '',
    curso: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    if (formData.senha !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Validar email usando regex simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }
    if (!utils.validPassword(formData.senha)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (!formData.matricula.trim()) {
      setError('Matrícula é obrigatória');
      return;
    }
    if (!utils.validRegistration(formData.matricula)) {
      setError('Matrícula inválida');
      return;
    }

    setLoading(true);

    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        papel: formData.papel,
        matricula: formData.matricula,
      });
      // O redirecionamento será feito automaticamente pelo PrivateRoute
    } catch (error: any) {
      let errorMsg = 'Erro ao criar conta. Tente novamente.';
      if (error?.response?.data?.mensagem) {
        errorMsg = error.response.data.mensagem;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      setError(errorMsg);
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
              Crie sua conta
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
                label="Nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Matrícula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
                helperText="Digite sua matrícula da UnB"
              />
              
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Confirmar senha"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Tipo de usuário</InputLabel>
                <Select
                  value={formData.papel}
                  onChange={(e) => setFormData({ ...formData, papel: e.target.value as UserRole })}
                  label="Tipo de usuário"
                >
                  <MenuItem value={UserRole.PARTICIPANT}>Participante</MenuItem>
                  <MenuItem value={UserRole.ORGANIZER}>Organizador</MenuItem>
                </Select>
              </FormControl>
              
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
                {loading ? 'Criando conta...' : 'CRIAR CONTA'}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ marginTop: 0.5, textAlign: 'center' }}>
              Já tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#133366',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Fazer login
              </Link>
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
