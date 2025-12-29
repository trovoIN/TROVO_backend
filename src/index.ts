import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { config } from './config.js'
import { logger } from './logger.js'
import earlyAccessRouter from './routes/earlyAccess.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: true, credentials: false }))
app.use(express.json())

app.get('/health', (_req: any, res: any) => res.json({ ok: true }))
app.use('/api', earlyAccessRouter)

app.use((err: Error, _req: any, res: any, _next: any) => {
  logger.error({ err }, 'unhandled error')
  res.status(500).json({ error: 'Unexpected error' })
})

// Start server (for Render deployment and local dev)
const PORT = config.port
app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'backend running')
})

export default app
