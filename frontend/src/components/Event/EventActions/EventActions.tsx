import React from 'react';
import { Button, Stack, Tooltip, IconButton } from '@mui/material';
import { AttachFile as AttachFileIcon, Edit as EditIcon, Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import type { Event } from '../../../types/event';
import { canEditEvent, canDeleteEvent, canUnregisterFromEvent, canRegisterForEvent } from '../../../utils';
import { useAuth } from '../../../auth/useAuth';

interface EventActionsProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onUpload?: (event: Event) => void;
  onRegister?: (event: Event) => void;
  onUnregister?: (event: Event) => void;
  isRegistered?: boolean;
}

export function EventActions({ event, onEdit, onDelete, onUpload, onRegister, onUnregister, isRegistered }: EventActionsProps) {
  const { user } = useAuth();
  const isFull = event.capacidade && event.quantidade_inscritos !== undefined ? event.quantidade_inscritos >= event.capacidade : false;
  const canEdit = onEdit && user ? canEditEvent(user, event) : false;
  const canDelete = onDelete && user ? canDeleteEvent(user, event) : false;
  const canUnregister = onUnregister && user ? canUnregisterFromEvent(user, event) : false;
  const canRegister = onRegister && canRegisterForEvent(event);

  return (
    <Stack direction="row" spacing={1}>
      {onRegister && !isRegistered && (
        <Tooltip title={!canRegister ? 'Não é possível inscrever-se em eventos que já passaram.' : ''}>
          <span>
            <Button
              variant={!canRegister ? 'outlined' : 'contained'}
              size="small"
              disabled={isRegistered || isFull || !canRegister}
              onClick={canRegister ? () => onRegister(event) : undefined}
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
        <Tooltip title={!canUnregister ? 'Só é possível cancelar inscrição antes do início do evento.' : ''}>
          <span>
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={!canUnregister}
              onClick={() => onUnregister(event)}
            >
              Cancelar Inscrição
            </Button>
          </span>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title={canEdit ? 'Editar evento' : 'Você não pode editar este evento'}>
          <span>
            <IconButton size="small" onClick={() => onEdit(event)} disabled={!canEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={canDelete ? 'Excluir evento' : 'Você não pode excluir este evento'}>
          <span>
            <IconButton size="small" color="error" onClick={() => onDelete(event)} disabled={!canDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {onUpload && (
        <Tooltip title="Gerenciar arquivos do evento">
          <span>
            <IconButton size="small" color="primary" onClick={() => onUpload(event)}>
              <AttachFileIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  );
} 