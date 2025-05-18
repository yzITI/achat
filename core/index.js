import { WebSocketServer } from 'ws'
import http from 'http'
import comet from './comet.js'
import httpHandler from './http.js'
import './model.js'

const wss = new WebSocketServer({ port: 8080 })
wss.on('connection', comet.initialize)
wss.on('listening', () => { console.log('# WebSocketServer listening on port 8080...') })

http.createServer(httpHandler).listen(8081, () => console.log('# HTTP Server listening on port 8081'))

