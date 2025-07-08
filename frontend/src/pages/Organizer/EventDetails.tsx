import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../hooks/useToast';
import { ToastComponent } from '../../components/Toast/Toast';
import { ActivityCard } from '../../components/ActivityCard/ActivityCard';
import { ActivityModal } from '../../components/ActivityModal/ActivityModal';
import { EventModal } from '../../components/Event/EventModal';
import { FileUpload } from '../../components/FileUpload/FileUpload';
import { canEditEvent, canDeleteEvent } from '../../utils/permissions';
import { eventService, activityService, fileService, certificateService } from '../../api/services';
import type { Event, Activity } from '../../types/event';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import { EventDetailsGeneric } from '../../components/Event/EventDetailsGeneric';
import { DeleteEventDialog } from '../../components/Dashboard/DeleteEventDialog';
import { DeleteActivityDialog } from '../../components/Dashboard/DeleteActivityDialog';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteActivityDialogOpen, setDeleteActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast, setToast, showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [eventFiles, setEventFiles] = useState<Array<{ id: number; nome_arquivo: string; url: string }>>([]);
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [finalizingEvent, setFinalizingEvent] = useState(false);
  const [certificatesGenerated, setCertificatesGenerated] = useState(false);
  const [certificatesCount, setCertificatesCount] = useState(0);

  const loadEventData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventService.getEventDetails(parseInt(id));
      setEvent(eventData);
      
      // Buscar atividades do evento da API
      try {
        const activitiesResponse = await activityService.getEventActivities(parseInt(id));
        setActivities(activitiesResponse || []);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        setActivities([]);
      }

      // Verificar se certificados já foram gerados para este evento
      if (eventData.status === 'concluido' && user?.papel === 'organizador') {
        try {
          const certificates = await certificateService.getEventCertificates(parseInt(id));
          setCertificatesGenerated(certificates.length > 0);
          setCertificatesCount(certificates.length);
        } catch (error) {
          console.error('Erro ao verificar certificados:', error);
          setCertificatesGenerated(false);
          setCertificatesCount(0);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do evento:', error);
      setError('Erro ao carregar dados do evento');
    } finally {
      setLoading(false);
    }
  }, [id, user?.papel]);

  // Carregar arquivos do evento
  const loadEventFiles = useCallback(async (eventId: number) => {
    try {
      const filesResponse = await fileService.getEventFiles(eventId);
      setEventFiles(filesResponse || []);
    } catch (error) {
      showError('Erro ao carregar arquivos do evento');
      setEventFiles([]);
    }
  }, []);

  // Carregar arquivos ao carregar evento
  useEffect(() => {
    if (event?.id) {
      loadEventFiles(event.id);
    }
  }, [event?.id, loadEventFiles]);

  useEffect(() => {
    if (id) {
      loadEventData();
    }
  }, [id, loadEventData]);

  const handleCreateActivity = () => {
    setSelectedActivity(undefined);
    setActivityModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setActivityModalOpen(true);
  };

  const handleActivitySuccess = async () => {
    // Recarregar atividades especificamente
    if (id) {
      try {
        const activitiesResponse = await activityService.getEventActivities(parseInt(id));
        setActivities(activitiesResponse);
      } catch (error) {
        console.error('Erro ao recarregar atividades:', error);
      }
    }
    showSuccess('Atividade salva com sucesso!');
  };

  const handleEventEdit = () => {
    setEventModalOpen(true);
  };

  const handleEventDelete = () => {
    if (!event || !user || !canDeleteEvent(user, event)) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!event) return;
    
    try {
      await eventService.deleteEvent(event.id);
      showSuccess('Evento excluído com sucesso!');
      navigate('/organizador');
    } catch (error) {
      showError('Erro ao excluir evento');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    setActivityToDelete(activity);
    setDeleteActivityDialogOpen(true);
  };

  const handleConfirmDeleteActivity = async () => {
    if (!activityToDelete) return;
    
    try {
      await activityService.deleteActivity(activityToDelete.id);
      showSuccess('Atividade excluída com sucesso!');
      // Recarregar atividades
      if (id) {
        const activitiesResponse = await activityService.getEventActivities(parseInt(id));
        setActivities(activitiesResponse);
      }
    } catch (error) {
      showError('Erro ao excluir atividade');
    } finally {
      setDeleteActivityDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleEventSuccess = () => {
    loadEventData();
    showSuccess('Evento atualizado com sucesso!');
  };

  // Funções de upload, delete, view e download
  const handleFileUpload = async (files: File[]) => {
    if (!event) return;
    try {
      for (const file of files) {
        await fileService.uploadForEvent(event.id, file);
      }
      showSuccess('Arquivos enviados com sucesso!');
      await loadEventFiles(event.id);
    } catch (error) {
      showError('Erro ao enviar arquivos');
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!event) return;
    try {
      await fileService.remove(fileId.toString());
      showSuccess('Arquivo excluído com sucesso!');
      await loadEventFiles(event.id);
    } catch (error) {
      showError('Erro ao excluir arquivo');
    }
  };

  const handleFileView = (file: { id: number; nome_arquivo: string; url: string }) => {
    window.open(file.url, '_blank');
  };

  const handleFileDownload = (file: { id: number; nome_arquivo: string; url: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.nome_arquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para gerar certificados
  const handleGenerateCertificates = async () => {
    if (!event) return;
    setGeneratingCertificates(true);
    try {
      const response = await certificateService.generateCertificate({
        evento_id: event.id,
        data_emissao: new Date().toISOString()
      });
      showSuccess('Certificados gerados com sucesso!');
      setCertificatesGenerated(true);
      // Atualizar contagem baseado na resposta do servidor
      if (response.data && Array.isArray(response.data)) {
        setCertificatesCount(response.data.length);
      }
    } catch (error) {
      showError('Erro ao gerar certificados');
    } finally {
      setGeneratingCertificates(false);
    }
  };

  // Função para finalizar evento
  const handleFinalizeEvent = async () => {
    if (!event) return;
    setFinalizingEvent(true);
    try {
      await eventService.updateEvent(event.id, { status: 'concluido' });
      showSuccess('Evento finalizado com sucesso!');
      loadEventData();
    } catch (error) {
      showError('Erro ao finalizar evento');
    } finally {
      setFinalizingEvent(false);
    }
  };

  // Estatísticas do evento para organizadores
  const eventStats = event && (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Estatísticas do Evento
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {event.quantidade_inscritos || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inscritos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {event.capacidade || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacidade
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {activities.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atividades
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {Math.round(((event.quantidade_inscritos || 0) / (event.capacidade || 1)) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ocupação
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </Box>
  );

  const isActive = event && (
    (event.status?.toLowerCase() === 'ativo' || 
     event.status?.toLowerCase() === 'active' ||
     event.status?.toLowerCase() === 'upcoming' ||
     !event.status) && // Se não há status definido, considerar ativo
    new Date(event.data_fim) > new Date() // Evento não terminou ainda
  );

  const actions = (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
      {event && user && canEditEvent(user, event) && (
        <IconButton
          color="primary"
          onClick={handleEventEdit}
        >
          <EditIcon />
        </IconButton>
      )}
      {event && user && canDeleteEvent(user, event) && (
        <IconButton
          color="error"
          onClick={handleEventDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}
      {isActive && (
        <Button
          variant="contained"
          onClick={handleCreateActivity}
          startIcon={<AddIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Nova Atividade
        </Button>
      )}
      {/* Botão para finalizar evento */}
      {event && user && user.papel === 'organizador' && event.status !== 'concluido' && (
        <Button
          variant="outlined"
          color="warning"
          onClick={handleFinalizeEvent}
          disabled={finalizingEvent}
        >
          {finalizingEvent ? 'Finalizando...' : 'Finalizar Evento'}
        </Button>
      )}
      {/* Botão para gerar certificados */}
      {event && user && user.papel === 'organizador' && event.status === 'concluido' && (
        certificatesGenerated ? (
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              // TODO: Implementar visualização do relatório de certificados
              showSuccess(`Certificados gerados: ${certificatesCount} participantes`);
            }}
          >
            Relatório gerado - Ver modelo ({certificatesCount})
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleGenerateCertificates}
            disabled={generatingCertificates}
          >
            {generatingCertificates ? 'Gerando...' : 'Gerar Certificados'}
          </Button>
        )
      )}
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={4}>
        <Box>
          <Breadcrumbs items={[
            { label: 'Dashboard', path: '/organizador' },
            { label: event?.nome || 'Detalhes do Evento' }
          ]} />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
        {eventStats}
        <EventDetailsGeneric
          event={event!}
          activities={activities}
          loading={loading}
          actions={actions}
          activityActions={(activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={isActive ? () => handleEditActivity(activity) : undefined}
              onDelete={isActive ? () => handleDeleteActivity(activity) : undefined}
            />
          )}
          onBack={() => navigate('/organizador')}
        />
        {/* Bloco de upload e visualização de arquivos do evento (apenas organizador) */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <FileUpload
              eventId={event?.id || 0}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
              onView={handleFileView}
              onDownload={handleFileDownload}
              existingFiles={eventFiles}
              disabled={loading}
            />
          </CardContent>
        </Card>
        <ActivityModal
          open={activityModalOpen}
          onOpenChange={setActivityModalOpen}
          activity={selectedActivity}
          eventId={parseInt(id!)}
          onSuccess={handleActivitySuccess}
        />
        {event && (
          <EventModal
            open={eventModalOpen}
            onOpenChange={setEventModalOpen}
            event={event}
            onSuccess={handleEventSuccess}
          />
        )}
        <DeleteEventDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          event={event}
          onConfirm={handleConfirmDelete}
          loading={false}
        />
        <DeleteActivityDialog
          open={deleteActivityDialogOpen}
          onClose={() => {
            setDeleteActivityDialogOpen(false);
            setActivityToDelete(null);
          }}
          activity={activityToDelete}
          onConfirm={handleConfirmDeleteActivity}
          loading={false}
        />
        <ToastComponent
          open={toast.open}
          onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
          title={toast.title}
          description={toast.description}
          type={toast.type}
        />
      </Stack>
    </Box>
  );
}
