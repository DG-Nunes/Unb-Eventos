import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Typography,
  Button,
  Box,
  Stack
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import type { Event, Activity } from '../../types/event';
import { formatDate } from '../../utils/formatters';
import { getEventStatusLabel, getEventStatusColor } from '../../utils/statusColors';

interface EventDetailsGenericProps {
  event: Event;
  activities: Activity[];
  loading?: boolean;
  header?: ReactNode;
  actions?: ReactNode;
  activityActions?: (activity: Activity) => ReactNode;
  onBack?: () => void;
  children?: ReactNode;
}

export function EventDetailsGeneric({
  event,
  activities,
  loading,
  header,
  actions,
  activityActions,
  onBack,
  children,
}: EventDetailsGenericProps) {
  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (!event || typeof event !== 'object') {
    return (
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography>Evento não encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Stack spacing={4}>
        {/* Header customizável */}
        {header || (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onBack && (
              <Button 
                variant="outlined" 
                onClick={onBack}
                startIcon={<ArrowBackIcon />}
              >
                Voltar
              </Button>
            )}
            <Chip 
              label={getEventStatusLabel(event.status || '')}
              color={getEventStatusColor(event.status || '')}
              size="small"
            />
          </Box>
        )}

        {/* Informações do Evento */}
        <Card>
          <CardContent>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  {event.nome}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {event.descricao}
                </Typography>
              </Box>

              <Divider />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Data de Início
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(event.data_inicio)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Data de Fim
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(event.data_fim)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Local
                    </Typography>
                    <Typography variant="h6">
                      {event.local || 'Local não definido'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Bloco
                    </Typography>
                    <Typography variant="h6">
                      {event.bloco || 'Bloco não definido'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Inscritos
                    </Typography>
                    <Typography variant="h6">
                      {event.quantidade_inscritos ?? 0} / {event.capacidade || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Typography variant="h6">
                      {getEventStatusLabel(event.status || '')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {actions && <Box sx={{ mt: 2 }}>{actions}</Box>}
            </Stack>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardContent>
            <Stack spacing={4}>
              <Typography variant="h5" fontWeight="bold">
                Atividades
              </Typography>
              {activities.length > 0 ? (
                <Stack spacing={3}>
                  {activities.map((activity) => (
                    <div key={activity.id}>
                      {children ? children : null}
                      {activityActions ? activityActions(activity) : (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {activity.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.descricao}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
                            <Typography variant="body2">
                              📅 {formatDate(activity.data_inicio)}
                            </Typography>
                            <Typography variant="body2">
                              ⏰ {formatDate(activity.data_fim)}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </div>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma atividade programada ainda.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
} 