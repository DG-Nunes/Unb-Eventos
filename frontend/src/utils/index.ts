import { getEventStatusConfig, getEventStatusLabel, getEventStatusColor } from './statusColors';
import { formatDate } from './formatters';
import { canEditEvent, canDeleteEvent, canUnregisterFromEvent } from './permissions';

export function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validPassword(password: string): boolean {
  return password.length >= 6;
}

export function validRegistration(registration: string): boolean {
  // Matrícula deve ter pelo menos 6 dígitos
  return /^\d{6,}$/.test(registration);
}

export const isEventPast = (event: any): boolean => {
  const now = new Date();
  const eventEndDate = new Date(event.data_fim);
  return now > eventEndDate;
};

export function getEventStatusText(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'ativo':
    case 'upcoming':
      return 'Em breve';
    case 'em andamento':
    case 'ongoing':
      return 'Em andamento';
    case 'concluído':
    case 'completed':
      return 'Concluído';
    case 'cancelado':
    case 'cancelled':
      return 'Cancelado';
    default:
      return status || 'Pendente';
  }
}

export { formatDate, formatDateTime } from './formatters';
export { getEventStatusLabel, getEventStatusColor } from './statusColors';
export { canEditEvent, canDeleteEvent, canUnregisterFromEvent } from './permissions';
export * from './permissions';

export default {
    validEmail,
    validPassword,
    validRegistration,
    formatDate,
    getEventStatusConfig,
    getEventStatusLabel,
    getEventStatusColor,
    canEditEvent,
    canDeleteEvent,
    isEventPast,
    canUnregisterFromEvent,
    getEventStatusText,
}; 