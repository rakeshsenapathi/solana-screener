import express from 'express'
import { createClient } from 'redis'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'

const app = express()
app.use(cors())
const server = createServer(app)
const wss = new WebSocketServer({ server })
const client = createClient()
await client.connect()

// Broadcast function to send LP data to all connected clients
function broadcastLPData(lpData) {
    const data = JSON.stringify(lpData)

    wss.clients.forEach((client) => {
        client.send(data)
    })
}

wss.on('connection', (ws) => {
    console.log('client connected to /dashboard')

    // fetchAndSendData()

    ws.on('close', (code, reason) => {
        console.log('connection closed', { code, reason })
    })

    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
    })
})

setInterval(fetchAndSendData, 3000)

async function fetchAndSendData() {
    try {
        const keys = await client.keys('token-pool-*')
        const lpData = []
        for (const key of keys) {
            const data = await client.hGetAll(key)
            lpData.push(data)
        }

        // Sort LP data by timestamp and send to the client
        lpData.sort((a, b) => b.timestamp - a.timestamp)

        broadcastLPData(lpData)
    } catch (err) {
        console.log('error occured while fetching and sending data', err)
    }
}

server.listen(4000, () => {
    console.log('listening on port 4000')
})
