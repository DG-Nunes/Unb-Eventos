import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';
import { FileUploadArea } from './FileUploadArea';
import { FileList } from './FileList';


interface FileUploadProps {
  eventId: number;
  onUpload?: (files: File[]) => void;
  onDelete?: (fileId: number) => void;
  onView?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  onDownload?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  existingFiles?: Array<{
    id: number;
    nome_arquivo: string;
    url: string;
  }>;
  disabled?: boolean;
  readOnly?: boolean;
}

export function FileUpload({ 
  eventId, 
  onUpload, 
  onDelete, 
  onView, 
  onDownload, 
  existingFiles = [], 
  disabled = false,
  readOnly = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadError(null);
    
    // Simular upload - em produção, aqui seria feita a chamada para a API
    setTimeout(() => {
      if (onUpload) {
        onUpload(Array.from(files));
      }
      setUploading(false);
    }, 1000);
  };

  const handleViewFile = (file: { id: number; nome_arquivo: string; url: string }) => {
    if (onView) {
      onView(file);
    } else {
      // Fallback: abrir em nova aba
      window.open(file.url, '_blank');
    }
  };

  const handleDownloadFile = (file: { id: number; nome_arquivo: string; url: string }) => {
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Arquivos do Evento
      </Typography>
      
      {/* Área de Upload - apenas se não for readOnly */}
      {!readOnly && (
        <FileUploadArea
          onFileSelect={handleFileSelect}
          uploading={uploading}
          disabled={disabled}
        />
      )}

      {/* Erro de Upload */}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      {/* Lista de Arquivos Existentes */}
      <FileList
        files={existingFiles}
        onDelete={onDelete}
        onView={handleViewFile}
        onDownload={handleDownloadFile}
        disabled={disabled}
        readOnly={readOnly}
      />
    </Box>
  );
} 