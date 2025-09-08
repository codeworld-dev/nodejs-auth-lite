import app from './app';
import express from 'express';
import http from 'http';
import configuration from './config';


const baseServer = express();
baseServer.use('/api', app);

const Startup = async (): Promise<http.Server | null> => { // Change return type to http.Server
    try {
        const httpServer = http.createServer(baseServer); // Change to http.createServer

        return new Promise<http.Server>((resolve, reject) => { // Change to http.Server
            httpServer.listen(configuration.port, () => { // Use config.port instead of app.get('port')
                console.log(`Server running on port ${configuration.port}`); // Use config.port
                resolve(httpServer);
            }).on('error', (error: NodeJS.ErrnoException) => {
                console.error("Error starting server:", error);
                reject(null);
            });
        });
    } catch (error) {
        console.error("Error starting server:", error);
        return null;
    }
};

const server = Startup();

export default server 