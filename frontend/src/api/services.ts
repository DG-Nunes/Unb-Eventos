import axios from './axios';
import type {
  User,
  Event,
  Activity,
  EventFile,
  EventRegistration,
  Certificate,
  LoginRequest,
  LoginResponse,
  RegisterUserRequest,
  CreateEventRequest,
  CreateActivityRequest,
  RegistrationRequest,
  CertificateRequest,
  EventFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../types/event';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  return 'Unexpected error';
}

// Auth Services
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>('/auth', credentials);
    return response.data;
  },

  register: async (userData: RegisterUserRequest): Promise<ApiResponse<User>> => {
    const response = await axios.post<ApiResponse<User>>('/usuarios', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axios.get<User>('/usuarios/profile');
    return response.data;
  },
};

// Event Services
export const eventService = {
  // Fetch available events (participant)
  fetchEvents: async (filters: EventFilters = {}, pagination: PaginationParams = {}): Promise<PaginatedResponse<Event>> => {
    const params = {
      pagina: pagination.pagina || 1,
      tamanho: pagination.tamanho || 10,
      pesquisa: filters.pesquisa,
      status: filters.status,
    };
    const response = await axios.get<PaginatedResponse<Event>>('/eventos', { params });
    return response.data;
  },

  // Fetch organizer's events with pagination
  fetchOrganizerEvents: async (pagination: PaginationParams & EventFilters = {}): Promise<Array<Event>> => {
    const params = {
      pagina: pagination.pagina || 1,
      tamanho: pagination.tamanho || 10,
      pesquisa: pagination.pesquisa,
      status: pagination.status,
    };
    const response = await axios.get<Array<Event>>('/organizador', { params });
    return response.data;
  },

  // Get event details
  getEventDetails: async (eventId: number): Promise<Event> => {
    const response = await axios.get<Event>(`/eventos/${eventId}`);
    return response.data;
  },

  // Create event
  createEvent: async (data: CreateEventRequest): Promise<ApiResponse<Event>> => {
    const response = await axios.post<ApiResponse<Event>>('/organizador/eventos/create', data);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId: number, data: Partial<CreateEventRequest>): Promise<ApiResponse<Event>> => {
    const response = await axios.put<ApiResponse<Event>>(`/organizador/eventos/${eventId}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/organizador/eventos/${eventId}`);
    return response.data;
  },

  // Create activity
  createActivity: async (data: CreateActivityRequest): Promise<ApiResponse<Activity>> => {
    const response = await axios.post<ApiResponse<Activity>>(`/organizador/eventos/${data.evento_id}/create/atividades`, data);
    return response.data;
  },

  // Update activity
  updateActivity: async (activityId: number, data: CreateActivityRequest): Promise<ApiResponse<Activity>> => {
    const response = await axios.put<ApiResponse<Activity>>(`/organizador/atividades/${activityId}`, data);
    return response.data;
  },

  // Upload event file
  uploadEventFile: async (eventId: number, file: File): Promise<ApiResponse<EventFile>> => {
    const formData = new FormData();
    formData.append('arquivo', file);
    const response = await axios.post<ApiResponse<EventFile>>(`/eventos/${eventId}/arquivos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List event files
  listEventFiles: async (eventId: number): Promise<EventFile[]> => {
    const response = await axios.get<EventFile[]>(`/eventos/${eventId}/arquivos`);
    return response.data;
  },

  // Delete event file
  deleteEventFile: async (eventId: number, fileId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/eventos/${eventId}/arquivos/${fileId}`);
    return response.data;
  },
};

// Activity Services
export const activityService = {
  // Get activities for an event
  getEventActivities: async (eventId: number): Promise<Activity[]> => {
    const response = await axios.get<Activity[]>(`/eventos/${eventId}/atividades`);
    return response.data;
  },

  // Get activity details
  getActivityDetails: async (activityId: number): Promise<Activity> => {
    const response = await axios.get<Activity>(`/atividades/${activityId}`);
    return response.data;
  },

  // Create activity
  createActivity: async (data: CreateActivityRequest): Promise<ApiResponse<Activity>> => {
    const response = await axios.post<ApiResponse<Activity>>(`/organizador/eventos/${data.evento_id}/atividades`, data);
    return response.data;
  },

  // Update activity
  updateActivity: async (activityId: number, data: CreateActivityRequest): Promise<ApiResponse<Activity>> => {
    const response = await axios.put<ApiResponse<Activity>>(`/organizador/atividades/${activityId}`, data);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (activityId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/organizador/atividades/${activityId}`);
    return response.data;
  },
};

// Registration Services
export const registrationService = {
  registerForEvent: async (eventId: number, data: RegistrationRequest): Promise<ApiResponse<EventRegistration>> => {
    const response = await axios.post<ApiResponse<EventRegistration>>(`/participante/eventos/${eventId}/inscricao`, data);
    return response.data;
  },

  listParticipantEvents: async (userId: number): Promise<Event[]> => {
    const response = await axios.get('/participante', { params: { usuario_id: userId } });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.eventos)) {
      return response.data.eventos;
    }
    return [];
  },

  listParticipantEventsPaginated: async (params: PaginationParams & { usuario_id: number }): Promise<PaginatedResponse<Event>> => {
    const query = {
      usuario_id: params.usuario_id,
      pagina: params.pagina || 1,
      tamanho: params.tamanho || 10,
    };
    const response = await axios.get<PaginatedResponse<Event>>('/participante/eventos', { params: query });
    return response.data;
  },

  cancelRegistration: async (eventId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/participante/eventos/${eventId}/desinscricao`);
    return response.data;
  },
};

// Certificate Services
export const certificateService = {
  generateCertificate: async (data: CertificateRequest): Promise<ApiResponse<Certificate>> => {
    const response = await axios.post<ApiResponse<Certificate>>('/certificados/organizador', data);
    return response.data;
  },

  // Get participant certificates
  getParticipantCertificates: async (): Promise<Certificate[]> => {
    const response = await axios.get<Certificate[]>(`/certificados/meus`);
    return response.data;
  },

  // Get certificate details
  getCertificateDetails: async (certificateId: number): Promise<Certificate> => {
    const response = await axios.get<Certificate>(`/certificados/${certificateId}`);
    return response.data;
  },

  // Get event certificates (for organizers)
  getEventCertificates: async (eventId: number): Promise<Certificate[]> => {
    const response = await axios.get<Certificate[]>(`/certificados/evento/${eventId}`);
    return response.data;
  },
};

// User Services
export const userService = {
  updateUser: async (userId: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axios.put<ApiResponse<User>>(`/usuarios/${userId}`, data);
    return response.data;
  },

  // Get all users (for admin)
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get<ApiResponse<User[]>>('/usuarios');
    return response.data;
  },

  // Create user (for admin)
  createUser: async (userData: RegisterUserRequest): Promise<ApiResponse<User>> => {
    const response = await axios.post<ApiResponse<User>>('/usuarios', userData);
    return response.data;
  },

  // Delete user (for admin)
  deleteUser: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/usuarios/${userId}`);
    return response.data;
  },
};

// File Services
export const fileService = {
  // Get files for an event
  getEventFiles: async (eventId: number): Promise<EventFile[]> => {
    const response = await axios.get<EventFile[]>(`/eventos/${eventId}/arquivos`);
    return response.data;
  },

  // Upload file
  upload: async (file: File): Promise<ApiResponse<EventFile>> => {
    const formData = new FormData();
    formData.append('arquivo', file);
    const response = await axios.post<ApiResponse<EventFile>>('/arquivos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload file for specific event
  uploadForEvent: async (eventId: number, file: File): Promise<ApiResponse<EventFile>> => {
    const formData = new FormData();
    formData.append('arquivo', file);
    const response = await axios.post<ApiResponse<EventFile>>(`/eventos/${eventId}/arquivos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file
  remove: async (fileId: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`/arquivos/${fileId}`);
    return response.data;
  },

  // Get file details
  getFileDetails: async (fileId: number): Promise<EventFile> => {
    const response = await axios.get<EventFile>(`/arquivos/${fileId}`);
    return response.data;
  },
};

 