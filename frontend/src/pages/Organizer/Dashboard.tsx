import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Alert,
  Box,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EventModal } from '../../components/Event/EventModal';
import { eventService } from '../../api/services';
import type { Event } from '../../types/event';
import { ToastComponent } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { EventFilters } from '../../components/Event/EventFilters';
import { FileUploadModal } from '../../components/FileUpload';
import { DashboardHeader, DeleteEventDialog, EventList } from '../../components/Dashboard';
import { PaginationInfo } from '../../components/Pagination/PaginationInfo';

const ITENS_POR_PAGINA = 10;

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterLoading, setFilterLoading] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [selectedEventForUpload, setSelectedEventForUpload] = useState<Event | null>(null);
  const [eventFiles, setEventFiles] = useState<Array<{ id: number; nome_arquivo: string; url: string }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  
  const { toast, setToast, showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{ pesquisa?: string; status?: string }>({});

  const carregarEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiFilters = {
        pesquisa: filters.pesquisa || undefined,
        status: filters.status || undefined,
      };
      const response = await eventService.fetchOrganizerEvents({
        pagina: page,
        tamanho: ITENS_POR_PAGINA,
        ...apiFilters,
      });
      setEvents(response);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setError('Erro ao carregar eventos da API');
      setEvents([]);
      setTotalPages(1);
      setTotalEvents(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleViewEventDetails = (event: Event) => {
    navigate(`/organizador/eventos/${event.id}`);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    try {
      setDeleteLoading(true);
      await eventService.deleteEvent(eventToDelete.id);
      showSuccess('Evento excluído com sucesso!');
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      carregarEventos();
    } catch (error) {
      showError('Erro ao excluir evento');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEventSuccess = () => {
    carregarEventos();
  };

  const handleUploadFiles = (event: Event) => {
    setSelectedEventForUpload(event);
    setFileUploadModalOpen(true);
    loadEventFiles(event.id);
  };

  const loadEventFiles = async (eventId: number) => {
    try {
      const files = await eventService.listEventFiles(eventId);
      setEventFiles(files);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      setEventFiles([]);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!selectedEventForUpload) return;
    
    try {
      for (const file of files) {
        await eventService.uploadEventFile(selectedEventForUpload.id, file);
      }
      showSuccess('Arquivos enviados com sucesso!');
      await loadEventFiles(selectedEventForUpload.id);
    } catch (error) {
      showError('Erro ao enviar arquivos');
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!selectedEventForUpload) return;
    
    try {
      await eventService.deleteEventFile(selectedEventForUpload.id, fileId);
      showSuccess('Arquivo excluído com sucesso!');
      await loadEventFiles(selectedEventForUpload.id);
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

  const handleSearch = () => {
    setFilters({ pesquisa: searchTerm, status: statusFilter === 'all' ? undefined : statusFilter });
    setPage(1);
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFilters({ pesquisa: '', status: undefined });
    setPage(1);
  };

  console.log(events, 'events');

  // Usar todos os eventos retornados pela API - a filtragem é feita pelo backend
  const upcomingEvents = events;
  const pastEvents = events;

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        Carregando...
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Stack spacing={4}>
        {/* Toast */}
        <ToastComponent
          open={toast.open}
          onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
          title={toast.title}
          description={toast.description}
          type={toast.type}
        />

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <DashboardHeader
          onCreateEvent={handleCreateEvent}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          upcomingEventsCount={upcomingEvents.length}
          pastEventsCount={pastEvents.length}
        />

        {/* Filtros */}
        <EventFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={filterLoading}
        />

        {/* Conteúdo das Tabs */}
        <Box>
          {activeTab === 0 && (
            <Box sx={{ mt: 3 }}>
              <EventList
                events={events}
                viewMode={viewMode}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onViewDetails={handleViewEventDetails}
                onUpload={handleUploadFiles}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 3 }}>
              <EventList
                events={events}
                viewMode={viewMode}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onViewDetails={handleViewEventDetails}
              />
            </Box>
          )}
        </Box>

        {/* Paginação */}
        <PaginationInfo
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalEvents}
          itemsPerPage={ITENS_POR_PAGINA}
          onPageChange={handlePageChange}
        />

        {/* Modal de Evento */}
        <EventModal
          open={eventModalOpen}
          onOpenChange={setEventModalOpen}
          event={selectedEvent}
          onSuccess={handleEventSuccess}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <DeleteEventDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          event={eventToDelete}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />

        {/* Modal de Upload de Arquivos */}
        <FileUploadModal
          open={fileUploadModalOpen}
          onClose={() => setFileUploadModalOpen(false)}
          event={selectedEventForUpload}
          onUpload={handleFileUpload}
          onDelete={handleFileDelete}
          onView={handleFileView}
          onDownload={handleFileDownload}
          existingFiles={eventFiles}
        />
      </Stack>
    </Box>
  );
}