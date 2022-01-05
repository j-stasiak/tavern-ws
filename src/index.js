import io from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
import { configureGameEvenets } from './game';
import { configureChatEvenets } from './chat';
import { createClient } from 'redis';

const redis = createClient();
const server = new io.Server();
let corsOrigin;

if(process.env.NODE_ENV  ===  'development') {
    corsOrigin = '*';
} else {
    corsOrigin = process.env.TAVERN_FRONTEND_HOST;
}

server.on('connection', (socket) => {
    configureGameEvenets(server, socket, redis);
    configureChatEvenets(server, socket, redis);
})

server.listen(3001, {cors: {origin: corsOrigin}});