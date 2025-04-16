import comet from './comet.js'
import WebSocket, { WebSocketServer } from 'ws'
import './model.js'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', comet.initialize)
console.log('# WebSocketServer started on port 8080...')

