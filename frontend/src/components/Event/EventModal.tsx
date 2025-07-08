import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Stack,
  IconButton,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { eventService } from '../../api/services';
import { FormField } from '../Forms/FormField';
import type { Event } from '../../types/event';
import { ToastComponent } from '../Toast/Toast';
import { useToast } from '../../hooks/useToast';

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  onSuccess: () => void;
}

export function EventModal({ open, onOpenChange, event, onSuccess }: EventModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    capacidade: 0,
    bloco: '',
    local: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [eventData, setEventData] = useState<Event | null>(null);
  const { toast, setToast, showSuccess, showError } = useToast();

  const isEditing = !!event;

  // Recuperar dados completos do evento quando estiver editando
  useEffect(() => {
    const loadEventData = async () => {
      if (isEditing && event?.id) {
        try {
          setLoading(true);
          const fullEventData = await eventService.getEventDetails(event.id);
          setEventData(fullEventData);
          setFormData({
            nome: fullEventData.nome || '',
            descricao: fullEventData.descricao || '',
            data_inicio: fullEventData.data_inicio ? new Date(fullEventData.data_inicio).toISOString().slice(0, 16) : '',
            data_fim: fullEventData.data_fim ? new Date(fullEventData.data_fim).toISOString().slice(0, 16) : '',
            capacidade: fullEventData.capacidade || 0,
            bloco: fullEventData.bloco || '',
            local: fullEventData.local || '',
          });
        } catch (error) {
          setMessage({ type: 'error', text: 'Erro ao carregar dados do evento' });
        } finally {
          setLoading(false);
        }
      } else if (!isEditing) {
        setFormData({
          nome: '',
          descricao: '',
          data_inicio: '',
          data_fim: '',
          capacidade: 0,
          bloco: '',
          local: '',
        });
        setEventData(null);
      }
    };

    if (open) {
      loadEventData();
    }
  }, [open, event?.id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (isEditing) {
        await eventService.updateEvent(event.id, formData);
        showSuccess('Evento atualizado com sucesso!');
      } else {
        await eventService.createEvent(formData);
        showSuccess('Evento criado com sucesso!');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      showError(isEditing ? 'Erro ao atualizar evento' : 'Erro ao criar evento');
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
      maxWidth="md"
      fullWidth
    >
      {/* Toast */}
      <ToastComponent
        open={toast.open}
        onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ position: 'relative', pr: 6 }}>
          {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
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

          {loading && isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Typography>Carregando dados do evento...</Typography>
            </Box>
          )}

          {!loading && (
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

              <Stack direction="row" spacing={2}>
                <FormField
                  label="Capacidade *"
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
                  required
                />

                <FormField
                  label="Bloco *"
                  value={formData.bloco}
                  onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                  required
                />
              </Stack>

              <FormField
                label="Local *"
                value={formData.local || ''}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                required
              />
            </Stack>
          )}
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
} 