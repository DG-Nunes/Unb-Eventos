import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FileUpload } from './FileUpload';
import type { Event } from '../../types/event';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onUpload?: (files: File[]) => void;
  onDelete?: (fileId: number) => void;
  onView?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  onDownload?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  existingFiles?: Array<{
    id: number;
    nome_arquivo: string;
    url: string;
  }>;
  readOnly?: boolean;
}

export function FileUploadModal({
  open,
  onClose,
  event,
  onUpload,
  onDelete,
  onView,
  onDownload,
  existingFiles = [],
  readOnly = false
}: FileUploadModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      if (onUpload) {
        await onUpload(files);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      if (onDelete) {
        await onDelete(fileId);
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  };

  const handleView = (file: { id: number; nome_arquivo: string; url: string }) => {
    if (onView) {
      onView(file);
    } else {
      // Fallback: abrir em nova aba
      window.open(file.url, '_blank');
    }
  };

  const handleDownload = (file: { id: number; nome_arquivo: string; url: string }) => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Fallback: download direto
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.nome_arquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!event) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Gerenciar Arquivos - {event.nome}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <FileUpload
          eventId={event.id}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onView={handleView}
          onDownload={handleDownload}
          existingFiles={existingFiles}
          disabled={uploading}
          readOnly={readOnly}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
} 