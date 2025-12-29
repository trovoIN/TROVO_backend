import dotenv from 'dotenv'

dotenv.config()

const required = (value: string | undefined, name: string) => {
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

const normalizePrivateKey = (raw: string) => {
  // Remove surrounding quotes if present (from .env parsing)
  let normalized = raw.replace(/^["']|["']$/g, '')
  // Replace escaped newlines with actual newlines
  return normalized.replace(/\\n/g, '\n')
}

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  cronSecret: process.env.CRON_SECRET,
  firebase: {
    projectId: required(process.env.FIREBASE_PROJECT_ID, 'FIREBASE_PROJECT_ID')?.replace(/^["']|["']$/g, ''),
    clientEmail: required(process.env.FIREBASE_CLIENT_EMAIL, 'FIREBASE_CLIENT_EMAIL')?.replace(/^["']|["']$/g, ''),
    privateKey: normalizePrivateKey(required(process.env.FIREBASE_PRIVATE_KEY, 'FIREBASE_PRIVATE_KEY')),
  },
  sendgrid: {
    apiKey: required(process.env.SENDGRID_API_KEY, 'SENDGRID_API_KEY'),
    from: process.env.SENDGRID_FROM || 'Trovo <hello@trovo.app>',
    templateId: process.env.SENDGRID_TEMPLATE_ID, // optional: use dynamic template if provided
    dataResidency: process.env.SENDGRID_REGION === 'eu' ? 'eu' : undefined,
  },
}
