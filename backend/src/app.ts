import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from '@config/env.js';
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler.js';
import { generalLimiter } from '@middlewares/rateLimiter.js';
import logger from '@core/logger.js';
import routes from '@routes/index.js';

const app: Express = express();

app.use(compression());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.cors.origin === '*' ? '*' : config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get(`/api/${config.apiVersion}`, (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dairy Cooperative Management System API',
    version: config.apiVersion,
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
