import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'loglevel';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { getRoutes } from './routes';
import { socketIdToWalletMap } from './store';

function startServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    app.use(cors());

    // we'll consider the socket to be part of the request
    app.set('socketio', io);

    app.use(express.json());

    // this is our "api", it just responds with the data we send to it
    app.use('/api', getRoutes());

    app.use(errorMiddleware);

    io.on('connection', (socket) => {
        logger.info(`User ${socket.id} connected`);
        const wallet = socket.handshake.query.wallet as string;
        socketIdToWalletMap.set(socket.id, wallet);

        logger.info(`User ${socket.id} connected with wallet ${wallet}`);

        socket.on('disconnect', () => {
            logger.info(`User ${socket.id} connected`);
            socketIdToWalletMap.delete(socket.id);
        });
    });

    return new Promise((resolve) => {
        const PORT = process.env.PORT || 3000;
        logger.info(`Starting server on port ${PORT}`);
        const server = httpServer.listen(PORT, () => {
            logger.info(`Listening on port ${PORT}`);
        });

        setupCloseOnExit(server);
        resolve(server);
    });
}

function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
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

function setupCloseOnExit(server: http.Server) {
    function exitHandler(options = { exit: false }) {
        server.close((err) => {
            if (err) {
                logger.error(err);
            }

            logger.info('Server closed');

            if (options.exit) process.exit();
        });
    }

    process.on('exit', exitHandler);

    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

export { startServer };
