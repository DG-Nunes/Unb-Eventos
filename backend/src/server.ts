import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import organizerRoutes from './routes/organizer';
import registrationRoutes from './routes/registrations';
import certificateRoutes from './routes/certificates';
import fileRoutes from './routes/files';
import activityRoutes from './routes/activities';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

// Logar a origem das requisições para debug
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

// Middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'https://events-management-eight.vercel.app',
  'https://events-management.vercel.app',
  'https://events-management-frontend.vercel.app',
  'https://events-management-frontend-nu.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/certificados', express.static(path.join(__dirname, '../public/certificados')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test route for certificates
app.get('/test-certificates', (req, res) => {
  res.json({ 
    message: 'Certificates route is working',
    routes: [
      'POST /certificados/organizador',
      'GET /certificados/meus',
      'GET /certificados/evento/:eventId',
      'GET /certificados/:id'
    ]
  });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  });
});

// Routes - apenas as rotas necessárias conforme contrato da API
app.use('/auth', authRoutes);
app.use('/usuarios', userRoutes);
app.use('/eventos', eventRoutes);
app.use('/organizador', organizerRoutes);
app.use('/participante', registrationRoutes);
app.use('/certificados', certificateRoutes);
app.use('/arquivos', fileRoutes);
app.use('/organizador', activityRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ mensagem: 'Endpoint não encontrado' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Exportar o app Express para Vercel
export default app;

// Adicionar listener para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Certificates endpoint: http://localhost:${PORT}/certificados/organizador`);
  });
} 