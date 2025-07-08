import { RegistrationStatus } from '../types/event';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRegistrationStatus = (status: RegistrationStatus): string => {
  const statusMap: Record<RegistrationStatus, string> = {
    [RegistrationStatus.CONFIRMED]: 'Confirmado',
    [RegistrationStatus.PENDING]: 'Pendente',
    [RegistrationStatus.CANCELLED]: 'Cancelado',
  };
  return statusMap[status] || status;
};

export const formatEventCapacity = (registered: number, capacity: number): string => {
  return `${registered}/${capacity}`;
};

export const formatEventDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = formatDateTime(startDate);
  const endFormatted = formatDateTime(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    // Same day
    return `${startFormatted.split(' ')[0]} ${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return `${startFormatted} - ${endFormatted}`;
}; 