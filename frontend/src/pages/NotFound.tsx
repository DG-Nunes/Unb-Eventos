import { 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Stack,
  Container
} from '@mui/material';
import { 
  Home as HomeIcon,
  Search as SearchIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card 
          elevation={3}
          sx={{ 
            width: '100%', 
            maxWidth: 500,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              {/* Ícone de erro */}
              <Box sx={{ color: 'error.main' }}>
                <ErrorIcon sx={{ fontSize: 80 }} />
              </Box>

              {/* Número 404 */}
              <Box>
                <Typography 
                  variant="h1" 
                  fontWeight="bold" 
                  color="primary"
                  sx={{ 
                    fontSize: { xs: '3rem', sm: '4rem' },
                    lineHeight: 1
                  }}
                >
                  404
                </Typography>
              </Box>

              {/* Título */}
              <Typography 
                variant="h4" 
                fontWeight="bold"
                color="text.primary"
              >
                Página não encontrada
              </Typography>

              {/* Descrição */}
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ maxWidth: 300 }}
              >
                A página que você está procurando não existe ou foi movida para outro endereço.
              </Typography>

              {/* Ações */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ width: '100%' }}
              >
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/login')}
                  sx={{ flex: 1 }}
                >
                  Voltar ao Login
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate(-1)}
                  sx={{ flex: 1 }}
                >
                  Voltar
                </Button>
              </Stack>

              {/* Informação adicional */}
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Se você acredita que isso é um erro, entre em contato com o suporte.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
