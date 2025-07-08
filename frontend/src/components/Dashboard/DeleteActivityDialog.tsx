import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import type { Atividade } from '../../types/event';

interface DeleteActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity: Atividade | null;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteActivityDialog({
  open,
  onClose,
  activity,
  onConfirm,
  loading
}: DeleteActivityDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir a atividade "{activity?.nome}"?
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