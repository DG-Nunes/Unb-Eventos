import type { ChipProps } from '@mui/material';
import { EventStatus } from '../types/event';

export interface StatusConfig {
  label: string;
  color: ChipProps['color'];
}

export const getEventStatusConfig = (status: EventStatus | string): StatusConfig => {
  // Normalizar o status para lowercase para evitar duplicatas
  const normalizedStatus = status.toLowerCase();
  
  const statusMap: Record<string, StatusConfig> = {
    'ativo': {
      label: 'Ativo',
      color: 'success',
    },
    'em andamento': {
      label: 'Em Andamento',
      color: 'warning',
    },
    'concluído': {
      label: 'Concluído',
      color: 'info',
    },
    'cancelado': {
      label: 'Cancelado',
      color: 'error',
    },
    'upcoming': {
      label: 'Próximo',
      color: 'primary',
    },
    'ongoing': {
      label: 'Em Andamento',
      color: 'warning',
    },
  };

  return statusMap[normalizedStatus] || {
    label: status,
    color: 'default',
  };
};

export const getEventStatusLabel = (status: EventStatus | string): string => {
  return getEventStatusConfig(status).label;
};

export const getEventStatusColor = (status: EventStatus | string): ChipProps['color'] => {
  return getEventStatusConfig(status).color;
};

// Alias para compatibilidade
export const getStatusColor = getEventStatusColor; 