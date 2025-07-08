import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Stack
} from '@mui/material';
import { useState } from 'react';
import type { User } from '../../types/event';
import { FormField } from '../Forms/FormField';
import { ToastComponent } from '../Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { userService } from '../../api/services';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess: (updatedUser: User) => void;
}

export function UserProfileModal({ open, onOpenChange, user, onSuccess }: UserProfileModalProps) {
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    matricula: user.matricula || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { toast, setToast, showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Validar dados antes de enviar
      if (!formData.email.trim()) {
        throw new Error('Email é obrigatório');
      }
      
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Email inválido');
      }
      
      // Preparar dados para envio (remover campos vazios)
      const updateData: Partial<User> = {
        email: formData.email.trim(),
        nome: formData.nome.trim(),
      };
      
      // Adicionar matrícula apenas se não estiver vazia
      if (formData.matricula.trim()) {
        updateData.matricula = formData.matricula.trim();
      }
      
      // Chamar API para atualizar usuário
      const response = await userService.updateUser(user.id, updateData);
      let updatedUser: User | null = null;
      if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
        updatedUser = response.data as User;
      } else if (response && typeof response === 'object' && 'id' in response) {
        updatedUser = response as User;
      }
      if (updatedUser) {
        showSuccess('Perfil atualizado com sucesso!');
        onSuccess(updatedUser);
        onOpenChange(false);
      } else {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      showError(errorMessage);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <ToastComponent
        open={toast.open}
        onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          Editar Perfil
        </DialogTitle>

        <DialogContent>
          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 2 }}
            >
              {message.text}
            </Alert>
          )}

          <Stack spacing={3}>
            <FormField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />

            <FormField
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <FormField
              label="Matrícula"
              value={formData.matricula}
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
              placeholder="Opcional"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            fullWidth
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
} 