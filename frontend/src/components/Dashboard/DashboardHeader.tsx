import { Box, Button, Typography, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add as AddIcon, TableRows as TableRowsIcon, ViewModule as ViewModuleIcon } from '@mui/icons-material';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

interface DashboardHeaderProps {
  onCreateEvent: () => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  activeTab: number;
  onTabChange: (tab: number) => void;
  upcomingEventsCount: number;
  pastEventsCount: number;
}

export function DashboardHeader({
  onCreateEvent,
  viewMode,
  onViewModeChange,
  activeTab,
  onTabChange,
  upcomingEventsCount,
  pastEventsCount,
}: DashboardHeaderProps) {
  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[
        { label: 'Início', path: '/' },
        { label: 'Dashboard' }
      ]} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Meus Eventos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie seus eventos e atividades
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateEvent}
        >
          Criar Evento
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(_, newValue) => newValue !== null && onTabChange(newValue)}
            aria-label="filtros de eventos"
            size="small"
          >
            <ToggleButton value={0} aria-label="eventos ativos">
              Eventos Ativos ({upcomingEventsCount})
            </ToggleButton>
            {/* <ToggleButton value={1} aria-label="eventos passados">
              Eventos Passados ({pastEventsCount})
            </ToggleButton> */}
          </ToggleButtonGroup>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => newValue && onViewModeChange(newValue)}
          aria-label="modo de visualização"
          size="small"
        >
          <ToggleButton value="cards" aria-label="cards">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table">
            <TableRowsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
} 