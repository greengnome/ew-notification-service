import logger from 'loglevel';
import { startServer } from './src/start.js';

const isTest = process.env.NODE_ENV === 'test';
const logLevel = process.env.LOG_LEVEL || (isTest ? 'warn' : 'info');

logger.setLevel(logLevel);

startServer({ port: 3000 });
