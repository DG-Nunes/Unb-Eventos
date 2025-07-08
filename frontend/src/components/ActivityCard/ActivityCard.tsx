import {
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { Activity } from '../../types/event';
import { formatDate } from '../../utils/formatters';

interface ActivityCardProps {
  activity: Activity;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ActivityCard({ activity, onEdit, onDelete, onClick }: ActivityCardProps) {
  return (
    <Card 
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold">
            {activity.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activity.descricao}
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography variant="body2">
              📅 {formatDate(activity.data_inicio)}
            </Typography>
            <Typography variant="body2">
              ⏰ {formatDate(activity.data_fim)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {onEdit && (
              <Button
                variant="contained"
                size="small"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onEdit(); 
                }}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(); 
                }}
              >
                Excluir
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
} 