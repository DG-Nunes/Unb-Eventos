import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider
} from '@mui/material';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserProfileModal } from '../UserProfileModal/UserProfileModal';
import type { User } from '../../types/event';

export function Header() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setProfileModalOpen(true);
    setAnchorEl(null);
  };

  const handleProfileUpdate = (updatedUser: User) => {
    updateProfile(updatedUser);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Toolbar>
          {/* Logo à esquerda */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              UNB - EVENTOS
            </Typography>
          </Box>

          {/* Informações do usuário à direita */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center'}}>
              <Typography variant="body2" color="text.secondary">
                {user.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              </Box>
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {user.nome ? user.nome.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >

               
                <MenuItem onClick={handleEditProfile}>
                  Editar Perfil
                </MenuItem>
                {user.papel === 'participante' && (
                  <>
                  <MenuItem onClick={() => { navigate('/participante/certificados'); setAnchorEl(null); }}>
                    Meus Certificados
                  </MenuItem>
                  
                  <MenuItem onClick={() => { navigate('/participante/eventos'); setAnchorEl(null); }}>
                  Dashboard
                </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Modal de Edição de Perfil */}
      {user && (
        <UserProfileModal
          open={profileModalOpen}
          onOpenChange={setProfileModalOpen}
          user={user}
          onSuccess={handleProfileUpdate}
        />
      )}
    </>
  );
} 