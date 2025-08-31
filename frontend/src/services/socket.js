// Simple socket.io client singleton
import { io } from 'socket.io-client'

let socket

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    })
  }
  return socket
}