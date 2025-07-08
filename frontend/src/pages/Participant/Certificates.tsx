import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Button, Stack } from '@mui/material';
import { certificateService } from '../../api/services';
import { useAuth } from '../../auth/useAuth';
import type { Certificate } from '../../types/event';

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getParticipantCertificates();
        setCertificates(data);
      } catch (err) {
        setError('Erro ao carregar certificados');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user]);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Meus Certificados
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : certificates.length === 0 ? (
        <Typography>Nenhum certificado encontrado.</Typography>
      ) : (
        <Stack spacing={3}>
          {certificates.map(cert => (
            <Card key={cert.id}>
              <CardContent>
                <Typography variant="h6">
                  Evento: {cert.inscricao?.evento?.nome || cert.evento_id}
                </Typography>
                <Typography>
                  Data de Emissão: {new Date(cert.data_emissao).toLocaleDateString()}
                </Typography>
                <Button
                  variant="outlined"
                  href={cert.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                  disabled={!cert.url}
                  component="a"
                >
                  Visualizar/Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
} 