import { Router } from 'express'
import { FieldValue } from 'firebase-admin/firestore'
import { z } from 'zod'
import { db } from '../firebase.js'
import { sendWelcomeEmail } from '../email.js'
import { logger } from '../logger.js'
import { config } from '../config.js'

const router = Router()

const payloadSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

router.post('/early-access', async (req, res) => {
  const parse = payloadSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const { email } = parse.data

  try {
    // Dedupe but allow resend if not yet sent
    const existing = await db.collection('early_access_emails').where('email', '==', email).limit(1).get()
    let docRef = existing.empty ? undefined : existing.docs[0].ref
    const prevStatus = existing.empty ? undefined : (existing.docs[0].get('status') as string | undefined)

    if (prevStatus === 'sent') {
      return res.status(200).json({ ok: true, duplicate: true })
    }

    if (!docRef) {
      docRef = await db.collection('early_access_emails').add({
        email,
        createdAt: FieldValue.serverTimestamp(),
        source: 'backend-api',
        status: 'pending',
      })
    } else {
      await docRef.update({
        status: 'pending',
        lastAttemptAt: FieldValue.serverTimestamp(),
      })
    }

    try {
      await sendWelcomeEmail(email)
      await docRef.update({ status: 'sent', sentAt: FieldValue.serverTimestamp() })
    } catch (mailErr) {
      logger.error({ err: mailErr }, 'email send failed')
      await docRef.update({ status: 'failed', error: (mailErr as any)?.message || 'send failed', lastErrorAt: FieldValue.serverTimestamp() })
      return res.status(502).json({ error: 'Email send failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    logger.error({ err }, 'failed to save early access email')
    return res.status(500).json({ error: 'Server error' })
  }
})

// Batch dispatcher: pulls pending emails from Firestore and sends welcome emails
// Protect with CRON_SECRET header to avoid abuse
// Get stats for LiveCounter
router.get('/stats', async (_req, res) => {
  try {
    const snapshot = await db.collection('early_access_emails').get()
    const BASE_OFFSET = 3726 // Starting count to show existing user base
    const totalCount = snapshot.size + BASE_OFFSET

    return res.json({ totalCount })
  } catch (err) {
    logger.error({ err }, 'failed to fetch stats')
    return res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Get user count with 24h stats (frontend expects this endpoint)
router.get('/user-count', async (_req, res) => {
  try {
    const snapshot = await db.collection('early_access_emails').get()
    const BASE_OFFSET = 3726 // Starting count to show existing user base
    const totalCount = snapshot.size + BASE_OFFSET

    // Calculate users joined in last 24 hours
    const now = Date.now()
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000

    let joinedLast24h = 0
    snapshot.docs.forEach(doc => {
      const createdAt = doc.get('createdAt')
      if (createdAt && createdAt.toMillis && createdAt.toMillis() >= twentyFourHoursAgo) {
        joinedLast24h++
      }
    })

    return res.json({ totalCount, joinedLast24h })
  } catch (err) {
    logger.error({ err }, 'failed to fetch user count')
    return res.status(500).json({ error: 'Failed to fetch user count' })
  }
})

router.post('/early-access/dispatch', async (req, res) => {
  if (config.cronSecret && req.headers['x-cron-secret'] !== config.cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const limit = Math.min(Number((req.body as any)?.limit) || 50, 200)
  const results: Array<{ email: string; status: 'sent' | 'failed'; error?: string }> = []

  try {
    const pendingSnap = await db
      .collection('early_access_emails')
      .where('status', '==', 'pending')
      .limit(limit)
      .get()

    if (pendingSnap.empty) {
      return res.json({ ok: true, processed: 0, message: 'No pending emails' })
    }

    for (const doc of pendingSnap.docs) {
      const email = doc.get('email') as string | undefined
      if (!email) continue

      try {
        await sendWelcomeEmail(email)
        await doc.ref.update({ status: 'sent', sentAt: FieldValue.serverTimestamp() })
        results.push({ email, status: 'sent' })
      } catch (err: any) {
        const errorMessage = err?.message || 'send failed'
        await doc.ref.update({ status: 'failed', error: errorMessage, lastErrorAt: FieldValue.serverTimestamp() })
        results.push({ email, status: 'failed', error: errorMessage })
        logger.error({ email, err }, 'batch email send failed')
      }
    }

    return res.json({ ok: true, processed: results.length, results })
  } catch (err) {
    logger.error({ err }, 'dispatch batch failed')
    return res.status(500).json({ error: 'Batch dispatch failed' })
  }
})

export default router
