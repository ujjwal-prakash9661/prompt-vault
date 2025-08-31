const { Server } = require('socket.io')
const aiService = require('../services/ai.service')
function setUpSocketServer(httpServer)
{
    // Allow Vite dev origin for websocket connection
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        }
    })

    io.on('connection', (socket) => {

        socket.on('ai-message', async (message) => {
            try {
                const result = await aiService.generateResponse(message)
                socket.emit('ai-response', result)
            } catch (err) {
                socket.emit('ai-error', 'Failed to generate response')
            }
        })

        socket.on('disconnect', () => { 
            // Optional: add cleanup if needed
        })
    })
}

module.exports = setUpSocketServer