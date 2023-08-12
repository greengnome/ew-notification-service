import logger, { LogLevelDesc } from 'loglevel';
import { startServer } from './src/start';

const isTest = process.env.NODE_ENV === 'test';
const logLevel: LogLevelDesc =
    (process.env.LOG_LEVEL as LogLevelDesc) ?? (isTest ? 'warn' : 'info');

logger.setLevel(logLevel);

startServer({ port: '9899' });
