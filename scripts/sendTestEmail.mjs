#!/usr/bin/env node
import nodemailer from 'nodemailer'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env') })

const to = process.argv[2]
if (!to) {
  console.error('Usage: node scripts/sendTestEmail.mjs you@example.com')
  process.exit(1)
}

const apiKey = process.env.SENDGRID_API_KEY
const from = process.env.SENDGRID_FROM
if (!apiKey || !from) {
  console.error('Missing SENDGRID_API_KEY or SENDGRID_FROM in .env')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: { user: 'apikey', pass: apiKey },
})

async function main() {
  try {
    await transporter.verify()
    console.log('SMTP connection verified with SendGrid.')
  } catch (err) {
    console.error('Transport verify failed:', err?.message || err)
    process.exit(1)
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Trovo test email',
      text: 'This is a test email from the Trovo backend (nodemailer + SendGrid).',
      html: '<p>This is a <strong>test email</strong> from the Trovo backend (nodemailer + SendGrid).</p>',
    })
    console.log('Send success:', info)
  } catch (err) {
    console.error('Send failed:', err?.message || err)
    if (err?.response) console.error('SMTP response:', err.response)
    process.exit(1)
  }
}

main()
