import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  Alert,
  Button
} from '@mui/material';
import { EventDetailsGeneric } from '../../components/Event/EventDetailsGeneric';
import { ActivityCard } from '../../components/ActivityCard/ActivityCard';
import { FileUpload, FileViewer } from '../../components/FileUpload';
import { canUnregisterFromEvent, canRegisterForEvent } from '../../utils/permissions';
import { eventService, registrationService, activityService, fileService } from '../../api/services';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../hooks/useToast';
import { ToastComponent } from '../../components/Toast/Toast';
import type { Event, Activity } from '../../types/event';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoaded, setEventLoaded] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [eventFiles, setEventFiles] = useState<Array<{
    id: number;
    nome_arquivo: string;
    url: string;
  }>>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast, setToast, showSuccess, showError } = useToast();

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const eventId = parseInt(id);
        // Buscar detalhes do evento
        const eventData = await eventService.getEventDetails(eventId);
        setEvent(eventData);
        setEventLoaded(true);
        // Buscar atividades do evento da API
        try {
          const activitiesResponse = await activityService.getEventActivities(eventId);
          setActivities(activitiesResponse || []);
        } catch (error) {
          console.error('Erro ao carregar atividades:', error);
          setActivities([]);
        }
        // Buscar eventos do usuário para verificar se está inscrito
        if (user) {
          const userEventsResponse = await registrationService.listParticipantEvents(user.id);
          setUserEvents(userEventsResponse || []);
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados do evento:', error);
        let errorMsg = 'Erro ao carregar dados do evento';
        if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.response?.data?.erro) {
          errorMsg = error.response.data.erro;
        } else if (error?.message) {
          errorMsg = error.message;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
      // Buscar arquivos do evento separadamente
      if (id) {
        try {
          const filesResponse = await fileService.getEventFiles(parseInt(id));
          setEventFiles(filesResponse || []);
        } catch (err) {
          showError('Erro ao carregar arquivos do evento');
          setEventFiles([]);
        }
      }
    };
    loadEventData();
  }, [id, user]);

  // Verificar se o usuário está inscrito no evento
  const isUserRegistered = (eventId: number) => {
    return userEvents.some(userEvent => userEvent.id === eventId);
  };

  const handleRegister = async () => {
    if (!user || !event) return;
    
    try {
      setRegistrationLoading(true);
      
      await registrationService.registerForEvent(event.id, { usuario_id: user.id, evento_id: event.id });
      
      showSuccess('Inscrição realizada com sucesso!');
      setIsRegistered(true);
      
      // Recarregar dados do usuário
      const userEventsData = await registrationService.listParticipantEvents(user.id);
      setUserEvents(userEventsData || []);
      
    } catch (error) {
      showError('Erro ao se inscrever no evento');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;
    
    try {
      setRegistrationLoading(true);
      
      await registrationService.cancelRegistration(event.id);
      
      showSuccess('Inscrição cancelada com sucesso!');
      setIsRegistered(false);
      
      // Recarregar dados do usuário
      const userEventsData = await registrationService.listParticipantEvents(user.id);
      setUserEvents(userEventsData || []);
      
    } catch (error) {
      showError('Erro ao cancelar inscrição');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!event) return;
    
    try {
      for (const file of files) {
        await eventService.uploadEventFile(event.id, file);
      }
      
      // Recarregar arquivos do evento
      const updatedFiles = await eventService.listEventFiles(event.id);
      setEventFiles(updatedFiles || []);
      showSuccess('Arquivos enviados com sucesso!');
    } catch (error) {
      showError('Erro ao fazer upload dos arquivos');
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!event) return;
    
    try {
      await eventService.deleteEventFile(event.id, fileId);
      
      // Recarregar arquivos do evento
      const updatedFiles = await eventService.listEventFiles(event.id);
      setEventFiles(updatedFiles || []);
      showSuccess('Arquivo excluído com sucesso!');
    } catch (error) {
      showError('Erro ao excluir arquivo');
    }
  };

  const handleFileView = (file: { id: number; nome_arquivo: string; url: string }) => {
    // Abrir arquivo em nova aba
    window.open(file.url, '_blank');
  };

  const handleFileDownload = (file: { id: number; nome_arquivo: string; url: string }) => {
    // Download direto do arquivo
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.nome_arquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Verificar se o usuário está inscrito
  const jaInscrito = event && isUserRegistered(event.id);
  const canRegister = event && canRegisterForEvent(event);
  const canUnregister = event && user && canUnregisterFromEvent(user, event);
  const eventEnded = event && new Date(event.data_fim) < new Date();

  const actions = (
    <div className="flex justify-center">
      {!jaInscrito ? (
        !isRegistered ? (
          canRegister ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              disabled={registrationLoading}
              sx={{ px: 3, py: 1 }}
            >
              {registrationLoading ? 'Inscrevendo...' : 'Inscrever-se'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{
                backgroundColor: 'grey.100',
                color: 'text.primary',
                borderColor: 'grey.300',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  borderColor: 'grey.300',
                },
                px: 3, py: 1
              }}
            >
              Não é possível inscrever-se
            </Button>
          )
        ) : (
          <Button
            variant="outlined"
            color="primary"
            disabled
            sx={{ px: 3, py: 1 }}
          >
            Inscrição Pendente
          </Button>
        )
      ) : (
        canUnregister && !eventEnded ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleUnregister}
            disabled={registrationLoading}
            sx={{ px: 3, py: 1 }}
          >
            {registrationLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            disabled
            sx={{ px: 3, py: 1 }}
          >
            {eventEnded ? 'Evento Finalizado' : 'Inscrito'}
          </Button>
        )
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/participante/eventos')}>
          Voltar para Eventos
        </Button>
      </div>
    );
  }

  if (!eventLoaded || !event) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Alert severity="warning" sx={{ mb: 2 }}>
          Evento não encontrado
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/participante/eventos')}>
          Voltar para Eventos
        </Button>
      </div>
    );
  }


  return (
    <>
      <ToastComponent
        open={toast.open}
        onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      
      <EventDetailsGeneric
        event={event as Event}
        activities={activities}
        loading={loading}
        onBack={() => navigate('/participante/eventos')}
        actions={actions}
        activityActions={(activity) => <ActivityCard key={activity.id} activity={activity} />}
      >
        {/* Seção de Arquivos do Evento */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <FileViewer
              files={eventFiles}
              onView={handleFileView}
              onDownload={handleFileDownload}
              disabled={loading}
            />
          </CardContent>
        </Card>
      </EventDetailsGeneric>
    </>
  );
}
