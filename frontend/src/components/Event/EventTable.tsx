import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import type { Evento } from '../../types/event';
import { formatDate } from '../../utils/formatters';
import { getEventStatusLabel, getEventStatusColor } from '../../utils/statusColors';

interface EventTableProps {
  events: Evento[];
  renderActions?: (event: Evento) => React.ReactNode;
  onRowClick?: (event: Evento) => void;
}

export function EventTable({ events, renderActions, onRowClick }: EventTableProps) {
  if (events.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Nenhum evento encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Nome
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Início
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Fim
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Categoria
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Professor
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
              Status
            </TableCell>
            {renderActions && (
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'grey.700' }}>
                Ações
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, idx) => (
            <TableRow 
              key={event.id} 
              onClick={() => onRowClick?.(event)}
              sx={{
                backgroundColor: idx % 2 === 0 ? 'grey.50' : 'background.paper',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                '&:last-child td': {
                  border: 0,
                },
              }}
            >
              <TableCell sx={{ maxWidth: 220 }}>
                <Tooltip title={event.nome} placement="top">
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: onRowClick ? 'pointer' : 'help',
                    }}
                  >
                    {event.nome}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', color: 'grey.700' }}>
                {formatDate(event.data_inicio)}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', color: 'grey.700' }}>
                {formatDate(event.data_fim)}
              </TableCell>
              <TableCell sx={{ maxWidth: 150 }}>
                <Tooltip title={event.categoria?.nome || 'Categoria não definida'} placement="top">
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: onRowClick ? 'pointer' : 'help',
                    }}
                  >
                    {event.categoria?.nome || 'Categoria não definida'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', color: 'grey.700' }}>
                {event.professor?.usuario?.email || 'Professor não definido'}
              </TableCell>
              <TableCell>
                <Chip
                  label={getEventStatusLabel(event.situacao || '')}
                  color={getEventStatusColor(event.situacao || '')}
                  size="small"
                />
              </TableCell>
              {renderActions && (
                <TableCell sx={{ whiteSpace: 'nowrap', color: 'grey.700' }}>
                  {renderActions(event)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 