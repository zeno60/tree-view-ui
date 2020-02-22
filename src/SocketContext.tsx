import { createContext } from 'react'
import { Socket } from 'socket.io-client';

const SocketContext = createContext(Socket);

export default SocketContext;