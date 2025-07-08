import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface FileListProps {
  files: Array<{
    id: number;
    nome_arquivo: string;
    url: string;
  }>;
  onDelete?: (fileId: number) => void;
  onView?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  onDownload?: (file: { id: number; nome_arquivo: string; url: string }) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function FileList({ 
  files, 
  onDelete, 
  onView, 
  onDownload, 
  disabled = false, 
  readOnly = false 
}: FileListProps) {
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

  if (files.length === 0) {
    return null;
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
                {onView && (
                  <Tooltip title="Visualizar arquivo">
                    <IconButton
                      edge="end"
                      onClick={() => onView(file)}
                      disabled={disabled}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onDownload && (
                  <Tooltip title="Baixar arquivo">
                    <IconButton
                      edge="end"
                      onClick={() => onDownload(file)}
                      disabled={disabled}
                      size="small"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {!readOnly && onDelete && (
                  <Tooltip title="Excluir arquivo">
                    <IconButton
                      edge="end"
                      onClick={() => onDelete(file.id)}
                      disabled={disabled}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 