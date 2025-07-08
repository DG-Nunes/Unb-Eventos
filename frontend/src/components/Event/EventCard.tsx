import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { Event } from '../../types/event';
import { canEditEvent, canDeleteEvent, canUnregisterFromEvent, canRegisterForEvent } from '../../utils';
import { formatDate } from '../../utils/formatters';
import { getEventStatusLabel, getEventStatusColor } from '../../utils/statusColors';
import { useAuth } from '../../auth/useAuth';

interface EventCardProps {
  event: Event;
  onViewDetails?: () => void;
  onRegister?: () => void;
  onUnregister?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
  showActions?: boolean;
  isRegistered?: boolean;
  variant?: 'default' | 'compact';
}

export function EventCard({ 
  event, 
  onViewDetails, 
  onRegister, 
  onUnregister,
  onEdit, 
  onDelete, 
  onUpload,
  showActions = true,
  isRegistered = false,
  variant = 'default'
}: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  
  const isFull = event.capacidade && event.quantidade_inscritos !== undefined ? event.quantidade_inscritos >= event.capacidade : false;

  const canEdit = onEdit && user ? canEditEvent(user, event) : false;
  const canDelete = onDelete && user ? canDeleteEvent(user, event) : false;
  const canUnregister = onUnregister && user ? canUnregisterFromEvent(user, event) : false;
  const canRegister = onRegister && canRegisterForEvent(event);

  const isDescriptionLong = event.descricao && event.descricao.length > 100;
  const truncatedDescription = event.descricao ? event.descricao.substring(0, 100) + '...' : '';

  const getEditTooltip = (): string => {
    if (event.status === 'concluído' || event.status === 'cancelado') {
      return 'Eventos concluídos não podem ser editados';
    }
    if (event.status === 'em andamento') {
      return 'Eventos em andamento não podem ser editados';
    }
    const now = new Date();
    const eventEndDate = new Date(event.data_fim);
    if (now > eventEndDate) {
      return 'Eventos que já passaram não podem ser editados';
    }
    return '';
  };

  const getDeleteTooltip = (): string => {
    if (event.status === 'em andamento') {
      return 'Eventos em andamento não podem ser excluídos';
    }
    const now = new Date();
    const eventStartDate = new Date(event.data_inicio);
    if (now >= eventStartDate) {
      return 'Eventos que já começaram não podem ser excluídos';
    }
    return '';
  };

  const getUnregisterTooltip = (): string => {
    const now = new Date();
    const eventEndDate = new Date(event.data_fim);
    if (now > eventEndDate) {
      return 'Eventos que já passaram não permitem cancelar inscrição';
    }
    return '';
  };

  const canUnregisterBtn = onUnregister && user ? canUnregisterFromEvent(user, event) : false;

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onViewDetails ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onViewDetails ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        } : {},
      }}
      onClick={onViewDetails}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Tooltip title={event.nome.length > 50 ? event.nome : ''} placement="top">
              <Typography 
                variant={variant === 'compact' ? 'h6' : 'h5'} 
                fontWeight="bold" 
                sx={{ 
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: event.nome.length > 50 ? 'help' : 'default'
                }}
              >
                {event.nome}
              </Typography>
            </Tooltip>
            {variant === 'default' && event.descricao && (
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                    minHeight: '4.2em', // 3 linhas * 1.4
                  }}
                >
                  {expanded ? event.descricao : truncatedDescription}
                </Typography>
                {isDescriptionLong && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    sx={{ 
                      mt: 1, 
                      p: 0, 
                      minWidth: 'auto',
                      textTransform: 'none',
                      color: 'primary.main'
                    }}
                  >
                    {expanded ? 'Ver menos' : 'Ver mais'}
                  </Button>
                )}
              </Box>
            )}
          </Box>
          {event.status && (
            <Chip 
              label={getEventStatusLabel(event.status)}
              color={getEventStatusColor(event.status)}
              size="small"
              sx={{ ml: 1, flexShrink: 0 }}
            />
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Stack spacing={1}>
            <Typography variant="body2">
              📅 {formatDate(event.data_inicio)}
            </Typography>
            <Typography variant="body2">
              📍 {event.local || 'Local não definido'}
            </Typography>
            <Typography variant="body2">
              👥 {event.quantidade_inscritos ?? 0} inscritos
            </Typography>
            {event.capacidade !== undefined && (
              <Typography variant="body2">
                🏷️ Capacidade: {event.capacidade}
              </Typography>
            )}
          </Stack>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            {onRegister && !isRegistered && (
              <Tooltip title={!canRegister ? 'Não é possível inscrever-se em eventos que já passaram.' : ''}>
                <span>
                  <Button
                    variant={!canRegister ? 'outlined' : 'contained'}
                    fullWidth
                    disabled={isRegistered || isFull || !canRegister}
                    onClick={canRegister ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRegister();
                    } : undefined}
                    sx={!canRegister ? {
                      backgroundColor: 'grey.100',
                      color: 'text.primary',
                      borderColor: 'grey.300',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                        borderColor: 'grey.300',
                      },
                    } : {}}
                  >
                    {!canRegister ? 'Não é possível inscrever-se' : isFull ? 'Lotado' : 'Inscrever-se'}
                  </Button>
                </span>
              </Tooltip>
            )}
            {onUnregister && isRegistered && (
              <Tooltip title={event.status === 'concluído' ? 'Este evento já foi concluído.' : (!canUnregisterBtn ? 'Só é possível cancelar inscrição antes do início do evento.' : getUnregisterTooltip())}>
                <span>
                  <Button
                    variant="outlined"
                    color={event.status === 'concluído' ? 'success' : 'error'}
                    fullWidth
                    disabled={event.status === 'concluído' || !canUnregisterBtn}
                    onClick={event.status === 'concluído' ? undefined : (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onUnregister();
                    }}
                  >
                    {event.status === 'concluído' ? 'Evento Concluído' : 'Cancelar Inscrição'}
                  </Button>
                </span>
              </Tooltip>
            )}

            {onEdit && (
              <Tooltip title={getEditTooltip()}>
                <span>
                  <IconButton
                    size="small"
                    disabled={!canEdit}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title={getDeleteTooltip()}>
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={!canDelete}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {onUpload && (
              <Tooltip title="Gerenciar arquivos do evento">
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onUpload();
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      )}
    </Card>
  );
} 