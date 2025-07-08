import rateLimit from 'express-rate-limit';

// Rate limit geral para todas as rotas
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    mensagem: 'Muitas requisições. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit mais restritivo para autenticação
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para upload de arquivos
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 uploads por IP
  message: {
    mensagem: 'Limite de uploads excedido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para criação de eventos
export const eventCreationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 eventos por organizador
  message: {
    mensagem: 'Limite de criação de eventos excedido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 