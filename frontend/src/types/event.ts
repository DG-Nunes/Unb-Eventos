export enum UserRole {
  ORGANIZER = 'organizador',
  PARTICIPANT = 'participante',
}

export enum EventStatus {
  ACTIVE = 'ativo',
  ONGOING = 'em andamento',
  COMPLETED = 'concluído',
  CANCELLED = 'cancelado',
  UPCOMING = 'upcoming',
  OCCURRING = 'ongoing',
}

export enum RegistrationStatus {
  CONFIRMED = 'confirmada',
  PENDING = 'pendente',
  CANCELLED = 'cancelada',
}

export enum ChipColor {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  DEFAULT = 'default',
  ERROR = 'error',
}

// API Response Types (Portuguese - from contract)
export interface User {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  papel: UserRole;
}

export interface Event {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  status?: EventStatus | string;
  quantidade_inscritos?: number;
  capacidade?: number;
  bloco?: string;
  organizador_id?: number;
}

export interface Activity {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  evento_id: number;
}

export interface EventFile {
  id: number;
  nome_arquivo: string;
  url: string;
  evento_id: number;
}

export interface EventRegistration {
  id: number;
  usuario_id: number;
  evento_id: number;
  data_inscricao: string;
  status: RegistrationStatus;
}

export interface Certificate {
  id: number;
  inscricao_id: number;
  usuario_id: number;
  evento_id: number;
  data_emissao: string;
  url: string | null;
  inscricao?: any;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: User;
}

export interface RegisterUserRequest {
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  papel: UserRole;
}

export interface CreateEventRequest {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  capacidade: number;
  bloco: string;
  status?: string;
}

export interface CreateActivityRequest {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  evento_id: number;
}

export interface RegistrationRequest {
  usuario_id: number;
  evento_id: number;
}

export interface CertificateRequest {
  evento_id: number;
  data_emissao: string;
}

export interface EventFilters {
  pesquisa?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface PaginationParams {
  pagina?: number;
  tamanho?: number;
}

export interface PaginatedResponse<T> {
  pagina: number;
  tamanho: number;
  total_paginas: number;
  dados: T[];
}

// Tipos legados para compatibilidade
export interface EventFilters {
  pesquisa?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface ApiResponse<T = unknown> {
  mensagem?: string;
  erro?: string;
  data?: T;
}

export interface EventSearchResponse {
  pagina: number;
  tamanho: number;
  total_paginas: number;
  total?: number;
  eventos: Event[];
}

export interface ParticipantEventsResponse {
  pagina: number;
  tamanho: number;
  total_paginas: number;
  eventos: Event[];
} 