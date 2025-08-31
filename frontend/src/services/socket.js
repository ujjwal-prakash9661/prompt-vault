// Simple socket.io client singleton
import { io } from 'socket.io-client'

let socket

export function getSocket() {
  if (!socket) {
    socket = io('https://prompt-vault-wnpk.onrender.com', {
      withCredentials: true,
      transports: ['websocket'],
    })
  }
  return socket
}