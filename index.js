import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import { dbConnect } from './src/db.js';
import { pollData } from './src/controllers/socket.js';

const server = http.createServer();

const PORT = process.env.PORT

const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN, 
      allowedHeaders: ["Token", "Authorization"],
      methods : ["GET" , "POST"],
      credentials: true
    }
  });

  pollData(io);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  dbConnect();