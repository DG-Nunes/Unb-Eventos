import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import type { Event } from '../../types/event';

interface DeleteEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteEventDialog({
  open,
  onClose,
  event,
  onConfirm,
  loading
}: DeleteEventDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir o evento "{event?.nome}"?
          Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 