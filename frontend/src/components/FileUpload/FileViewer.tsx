import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface FileViewerProps {
  files: Array<{
    id: number;
    nome_arquivo: string;
    url: string;
  }>;
  onView?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  onDownload?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  disabled?: boolean;
}

export function FileViewer({ 
  files, 
  onView, 
  onDownload, 
  disabled = false 
}: FileViewerProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PdfIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon />;
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
        return <DescriptionIcon />;
      default:
        return <FileIcon />;
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

  if (files.length === 0) {
    return (
      <Alert severity="info">
        Nenhum arquivo disponível para este evento.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Arquivos do Evento ({files.length})
      </Typography>
      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 1,
              mb: 1,
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {getFileIcon(file.nome_arquivo)}
              <ListItemText
                primary={file.nome_arquivo}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label="Arquivo do Evento" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                }
                sx={{ ml: 2 }}
              />
            </Box>
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Visualizar arquivo">
                  <IconButton
                    edge="end"
                    onClick={() => handleView(file)}
                    disabled={disabled}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Baixar arquivo">
                  <IconButton
                    edge="end"
                    onClick={() => handleDownload(file)}
                    disabled={disabled}
                    size="small"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 