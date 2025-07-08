import type { User, Event } from '../types/event';
import { UserRole } from '../types/event';

export const canEditEvent = (user: User, event: Event): boolean => {
  if (!user || !event) return false;
  
  // Apenas organizadores podem editar eventos
  if (user.papel !== UserRole.ORGANIZER) return false;
  
  // Verificar se é o organizador responsável pelo evento
  const isOrganizer = event.organizador_id === user.id;
  if (!isOrganizer) return false;
  
  // Verificar se o evento ainda não aconteceu (data de início é hoje ou no futuro)
  const eventDate = new Date(event.data_inicio);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset para início do dia
  const eventNotStarted = eventDate >= today;
  
  return eventNotStarted;
};

export const canDeleteEvent = (user: User, event: Event): boolean => {
  if (!user || !event) return false;
  
  // Apenas organizadores podem deletar eventos
  if (user.papel !== UserRole.ORGANIZER) return false;
  
  // Verificar se é o organizador responsável pelo evento
  const isOrganizer = event.organizador_id === user.id;
  if (!isOrganizer) return false;
  
  // Verificar se o evento ainda não aconteceu (data de início é hoje ou no futuro)
  const eventDate = new Date(event.data_inicio);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset para início do dia
  const eventNotStarted = eventDate >= today;
  
  return eventNotStarted;
};

export const canUnregisterFromEvent = (user: User, event: Event): boolean => {
  if (!user || !event) return false;
  
  // Apenas participantes podem se desinscrever
  if (user.papel !== UserRole.PARTICIPANT) return false;
  
  const now = new Date();
  const eventStart = new Date(event.data_inicio);
  return eventStart > now;
};

export const canRegisterForEvent = (event: Event): boolean => {
  if (!event) return false;
  const now = new Date();
  const eventStart = new Date(event.data_inicio);
  return eventStart > now;
};

export const canEditActivity = (user: User, event: Event): boolean => {
  if (!user || !event) return false;
  
  // Apenas organizadores podem editar atividades
  if (user.papel !== UserRole.ORGANIZER) return false;
  
  // Verificar se é o organizador responsável pelo evento
  const isOrganizer = event.organizador_id === user.id;
  if (!isOrganizer) return false;
  
  // Verificar se o evento ainda não aconteceu
  const eventDate = new Date(event.data_inicio);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventNotStarted = eventDate >= today;
  
  return eventNotStarted;
};

export const canDeleteActivity = (user: User, event: Event): boolean => {
  if (!user || !event) return false;
  
  // Apenas organizadores podem deletar atividades
  if (user.papel !== UserRole.ORGANIZER) return false;
  
  // Verificar se é o organizador responsável pelo evento
  const isOrganizer = event.organizador_id === user.id;
  if (!isOrganizer) return false;
  
  // Verificar se o evento ainda não aconteceu
  const eventDate = new Date(event.data_inicio);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventNotStarted = eventDate >= today;
  
  return eventNotStarted;
}; 