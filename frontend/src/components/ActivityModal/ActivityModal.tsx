import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Stack,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { eventService } from '../../api/services';
import { FormField } from '../Forms/FormField';
import type { Activity } from '../../types/event';

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity;
  eventId: number;
  onSuccess: () => void;
}

export function ActivityModal({ open, onOpenChange, activity, eventId, onSuccess }: ActivityModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activity) {
      setFormData({
        nome: activity.nome || '',
        descricao: activity.descricao || '',
        data_inicio: activity.data_inicio ? new Date(activity.data_inicio).toISOString().slice(0, 16) : '',
        data_fim: activity.data_fim ? new Date(activity.data_fim).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({ nome: '', descricao: '', data_inicio: '', data_fim: '' });
    }
  }, [activity, open]);

  const isEditing = !!activity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (isEditing) {
        await eventService.updateActivity(activity!.id, {
          ...formData,
          evento_id: eventId,
        });
        setMessage({ type: 'success', text: 'Atividade atualizada com sucesso!' });
      } else {
        await eventService.createActivity({
          ...formData,
          evento_id: eventId,
        });
        setMessage({ type: 'success', text: 'Atividade criada com sucesso!' });
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      setMessage({ type: 'error', text: isEditing ? 'Erro ao atualizar atividade' : 'Erro ao criar atividade' });
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
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ position: 'relative', pr: 6 }}>
          {isEditing ? 'Editar Atividade' : 'Criar Nova Atividade'}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
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
              label="Descrição *"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              multiline
              rows={4}
            />

            <Stack direction="row" spacing={2}>
              <FormField
                label="Data de Início *"
                type="datetime-local"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />

              <FormField
                label="Data de Fim *"
                type="datetime-local"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
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
            {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
} 