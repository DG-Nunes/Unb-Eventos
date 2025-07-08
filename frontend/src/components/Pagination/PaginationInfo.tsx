import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {totalPages > 1 && (
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={onPageChange}
          color="primary"
        />
      )}

      {totalItems > 0 && (
        <Typography variant="body2" color="text.secondary">
          Mostrando {startItem}-{endItem} de {totalItems} eventos
        </Typography>
      )}
    </Box>
  );
} 