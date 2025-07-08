import { Typography, Grid } from '@mui/material';
import type { Event } from '../../types/event';
import { EventCard } from '../Event/EventCard';
import { EventTable } from '../Event/EventTable';
import { EventActions } from '../Event/EventActions';

interface EventListProps {
  events: Event[];
  viewMode: 'cards' | 'table';
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onViewDetails: (event: Event) => void;
  onUpload?: (event: Event) => void;
  onRegister?: (event: Event) => void;
  onUnregister?: (event: Event) => void;
  isRegistered?: (event: Event) => boolean;
}

export function EventList({
  events,
  viewMode,
  onEdit,
  onDelete,
  onViewDetails,
  onUpload,
  onRegister,
  onUnregister,
  isRegistered
}: EventListProps) {
  if (events.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        Nenhum evento encontrado.
      </Typography>
    );
  }

  if (viewMode === 'cards') {
    return (
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <EventCard
              event={event}
              onEdit={() => onEdit(event)}
              onDelete={() => onDelete(event)}
              onViewDetails={() => onViewDetails(event)}
              onUpload={onUpload ? () => onUpload(event) : undefined}
              onRegister={onRegister ? () => onRegister(event) : undefined}
              onUnregister={onUnregister ? () => onUnregister(event) : undefined}
              isRegistered={isRegistered ? isRegistered(event) : false}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <EventTable
      events={events}
      onRowClick={onViewDetails}
      renderActions={(event) => (
        <EventActions
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpload={onUpload}
          onRegister={onRegister}
          onUnregister={onUnregister}
          isRegistered={isRegistered ? isRegistered(event) : false}
        />
      )}
    />
  );
} 