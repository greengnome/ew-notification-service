import express from 'express';
import 'express-async-errors';
import logger from 'loglevel';
import http from 'http';
import { Server } from 'socket.io';

import { getRoutes } from './routes/index.js';

function startServer({ port = process.env.PORT } = {}) {
    const app = express();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    app.set('socketio', io);

    app.use('/api', getRoutes());
    app.use(errorMiddleware);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return new Promise((resolve) => {
        const server = httpServer.listen(port, () => {
            logger.info(`Listening on port ${server.address().port}`);
            const originalClose = server.close.bind(server);
            server.close = () => {
                return new Promise((resolveClose) => {
                    originalClose(resolveClose);
                });
            };
            setupCloseOnExit(server);
            resolve(server);
        });
    });
}

function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        next(error);
    } else {
        logger.error(error);
        res.status(500);
        res.json({
            message: error.message,
            // we only add a `stack` property in non-production environments
            ...(process.env.NODE_ENV === 'production'
                ? null
                : { stack: error.stack }),
        });
    }
}

function setupCloseOnExit(server) {
    async function exitHandler(options = {}) {
        await server
            .close()
            .then(() => {
                logger.info('Server successfully closed');
            })
            .catch((e) => {
                logger.warn('Something went wrong closing the server', e.stack);
            });
        if (options.exit) process.exit();
    }

    process.on('exit', exitHandler);

    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

export { startServer };
