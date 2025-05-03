// AChat Core
console.log('Starting core #...')
import './core/index.js'

// AChat Web
app.use(express.static('./web/build/'))

// AChat File Server
import express from 'express'
const app = express()
app.listen(8081, () => { console.log('> File server listening on port 8081') })

