import { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Stack,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ViewModule as ViewModuleIcon, ViewList as ViewListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { eventService, registrationService } from '../../api/services';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { ToastComponent } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import type { Event, EventFilters } from '../../types/event';
import { EventCard } from '../../components/Event/EventCard';
import { EventTable } from '../../components/Event/EventTable';
import { canUnregisterFromEvent } from '../../utils';
import { PaginationInfo } from '../../components/Pagination';
import { EventFilters as EventFiltersComponent } from '../../components/Event/EventFilters';

const ITEMS_PER_PAGE = 10;

export default function AvailableEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [userEventsLoading, setUserEventsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const { toast, setToast, showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Carregar eventos e inscrições do usuário apenas na inicialização
  useEffect(() => {
    loadEvents();
    loadUserEvents();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [filters, currentPage]);

  const loadEvents = useCallback(async () => {
    if (!user) return;
    
    try {
      setEventsLoading(true);
      setError(null);
      
      const response = await eventService.fetchEvents(filters, { pagina: currentPage, tamanho: ITEMS_PER_PAGE });
      setEvents(response.dados || (response as any).eventos || []);
      setTotalPages(response.total_paginas || 1);
      setTotalEvents((response.dados || (response as any).eventos || []).length || 0);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setError('Erro ao carregar eventos');
    } finally {
      setEventsLoading(false);
    }
  }, [filters, currentPage, ITEMS_PER_PAGE, user]);

  const loadUserEvents = useCallback(async () => {
    if (!user) return;
    
    try {
      setUserEventsLoading(true);
      const userEventsResponse = await registrationService.listParticipantEvents(user.id);
      setUserEvents(userEventsResponse || []);
    } catch (error) {
      console.error('Erro ao carregar eventos do usuário:', error);
    } finally {
      setUserEventsLoading(false);
    }
  }, [user]);

  const handleSearch = useCallback(() => {
    setFilters({
      pesquisa: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    });
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleViewDetails = (event: Event) => {
    navigate(`/participante/eventos/${event.id}`);
  };

  const handleRegister = async (event: Event) => {
    if (!user) return;
    
    try {
      await registrationService.registerForEvent(event.id, { usuario_id: user.id, evento_id: event.id });
      showSuccess('Inscrição realizada com sucesso!');
      // Recarregar eventos do usuário
      await loadUserEvents();
    } catch (error) {
      showError('Erro ao se inscrever no evento');
    }
  };

  const handleUnregister = async (eventId: number) => {
    if (!user) return;
    try {
      await registrationService.cancelRegistration(eventId);
      showSuccess('Inscrição cancelada com sucesso!');
      await loadUserEvents();
      await loadEvents();
    } catch (error) {
      showError('Erro ao cancelar inscrição');
    }
  };

  const isUserRegistered = (eventId: number) => {
    return Array.isArray(userEvents) && userEvents.some(userEvent => userEvent.id === eventId);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (eventsLoading || userEventsLoading) {
    return <LoadingSpinner message="Carregando eventos..." />;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={4}>
        
        {/* Toast Component */}
        <ToastComponent
          open={toast.open}
          onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
          title={toast.title}
          description={toast.description}
          type={toast.type}
        />
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Eventos Disponíveis
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Olá, <b>{user?.nome || 'Usuário'}</b> — Encontre eventos interessantes para participar.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('/participante/meus-eventos')}>
            Meus Eventos
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <EventFiltersComponent
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={eventsLoading}
        />

        {/* Toggle de Visualização */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setViewMode(newValue);
              }
            }}
            aria-label="modo de visualização"
            size="small"
          >
            <ToggleButton value="cards" aria-label="cards">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Lista de Eventos */}
        {viewMode === 'cards' ? (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={6} lg={6} key={event.id}>
                  <EventCard
                    event={event}
                    onViewDetails={() => handleViewDetails(event)}
                    onRegister={() => handleRegister(event)}
                    onUnregister={() => handleUnregister(event.id)}
                    isRegistered={isUserRegistered(event.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <EventTable 
            events={events}
            onRowClick={(event) => handleViewDetails(event)}
            renderActions={(event) => {
              const isRegistered = isUserRegistered(event.id);
              const canUnregister = isRegistered && user && canUnregisterFromEvent(user, event);
              
              return (
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewDetails(event)}
                  >
                    Ver
                  </Button>
                  {!isRegistered ? (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleRegister(event)}
                    >
                      Inscrever
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleUnregister(event.id)}
                      disabled={!canUnregister}
                      title={!canUnregister ? "Não é mais possível cancelar a inscrição" : ""}
                    >
                      Cancelar
                    </Button>
                  )}
                </Stack>
              );
            }}
          />
        )}

        {/* Paginação */}
        <PaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalEvents}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />

        {events.length === 0 && !eventsLoading && (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum evento encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente ajustar os filtros de busca
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
} 