import { useState, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Tabs,
  Tab,
  Stack,
  Alert,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { registrationService } from '../../api/services';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import type { Event } from '../../types/event';
import { EventCard } from '../../components/Event/EventCard';
import { useToast } from '../../hooks/useToast';
import { ToastComponent } from '../../components/Toast/Toast';

export default function MyEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, setToast, showSuccess, showError } = useToast();

  const loadUserEvents = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const userEventsResp: any = await registrationService.listParticipantEvents(user.id);
      let userEvents: Event[] = [];
      if (Array.isArray(userEventsResp)) {
        userEvents = userEventsResp;
      } else if (userEventsResp && typeof userEventsResp === 'object' && 'data' in userEventsResp && Array.isArray(userEventsResp.data)) {
        userEvents = userEventsResp.data;
      }
      // Filtrar eventos por data
      const now = new Date();
      const upcoming = userEvents.filter((event: Event) => new Date(event.data_inicio) >= now);
      const past = userEvents.filter((event: Event) => new Date(event.data_inicio) < now);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Erro ao carregar eventos do usuário:', error);
      setError('Erro ao carregar seus eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUnregister = async (eventId: number) => {
    if (!user) return;
    try {
      await registrationService.cancelRegistration(eventId);
      showSuccess('Inscrição cancelada com sucesso!');
      await loadUserEvents();
    } catch (error) {
      showError('Erro ao cancelar inscrição');
    }
  };

  const handleViewDetails = (event: Event) => {
    navigate(`/participante/eventos/${event.id}`);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando seus eventos..." />;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={4}>
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
              Meus Eventos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Olá, {user?.email || 'usuário'}! Aqui estão os eventos dos quais você participa.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('/participante/eventos')}>
            Ver Todos os Eventos
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label={`Próximos (${upcomingEvents.length})`} />
            <Tab label={`Passados (${pastEvents.length})`} />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && (
              <>
                <Grid container spacing={3}>
                  {upcomingEvents.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                      <EventCard
                        event={event}
                        onViewDetails={() => handleViewDetails(event)}
                        onUnregister={() => handleUnregister(event.id)}
                        isRegistered={true}
                      />
                    </Grid>
                  ))}
                </Grid>

                {upcomingEvents.length === 0 && (
                  <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                    <Typography>
                      Nenhum evento próximo.{' '}
                      <Button variant="text" onClick={() => navigate('/participante/eventos')}>
                        Ver Eventos Disponíveis
                      </Button>
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                <Grid container spacing={3}>
                  {pastEvents.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                      <EventCard
                        event={event}
                        onViewDetails={() => handleViewDetails(event)}
                        onUnregister={() => handleUnregister(event.id)}
                        isRegistered={true}
                      />
                    </Grid>
                  ))}
                </Grid>

                {pastEvents.length === 0 && (
                  <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                    <Typography>
                      Nenhum evento passado.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
