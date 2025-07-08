import {
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { FormField } from '../Forms/FormField';
import type { EventFilters } from '../../types/event';

interface EventFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading?: boolean;
}

export function EventFilters({
  searchTerm,
  statusFilter,
  onSearchTermChange,
  onStatusFilterChange,
  onSearch,
  onClear,
  loading = false
}: EventFiltersProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Buscar eventos
            </Typography>
            <FormField
              placeholder="Digite o nome do evento..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchTermChange(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
            />
          </Box>
          <Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="em andamento">Em andamento</MenuItem>
                <MenuItem value="concluído">Concluído</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button 
            onClick={onSearch} 
            disabled={loading}
            variant="contained"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onClear} 
            disabled={loading}
          >
            Limpar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
} 