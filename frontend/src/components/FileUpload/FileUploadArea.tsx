import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface FileUploadAreaProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  disabled?: boolean;
}

export function FileUploadArea({ onFileSelect, uploading, disabled = false }: FileUploadAreaProps) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        border: '2px dashed',
        borderColor: 'grey.300',
        backgroundColor: 'background.paper',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': !disabled ? {
          borderColor: 'primary.main',
          backgroundColor: 'primary.50',
        } : {},
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Clique para selecionar arquivos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Suporta: PDF, DOC, DOCX, XLS, XLSX, imagens (JPG, PNG, GIF) e TXT
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tamanho máximo: 10MB por arquivo
        </Typography>
        {!disabled && (
          <Box>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
              onChange={onFileSelect}
              style={{ display: 'none' }}
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ mt: 2 }}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Enviando...
                  </>
                ) : (
                  'Selecionar Arquivos'
                )}
              </Button>
            </label>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 