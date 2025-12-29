#!/usr/bin/env node
// Lightweight dispatcher to trigger batch email sends from Firestore
// Usage:
//   CRON_SECRET=your-secret node scripts/dispatchPending.mjs
// Optional envs:
//   DISPATCH_URL (default: http://localhost:4000/api/early-access/dispatch)
//   DISPATCH_LIMIT (default: 50, max 200)

const url = process.env.DISPATCH_URL || 'http://localhost:4000/api/early-access/dispatch'
const secret = process.env.CRON_SECRET
const limit = Math.min(Number(process.env.DISPATCH_LIMIT) || 50, 200)

if (!secret) {
  console.error('CRON_SECRET is required to call the dispatcher. Set it in your env.')
  process.exit(1)
}

async function main() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': secret,
      },
      body: JSON.stringify({ limit }),
    })

    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }

    if (!res.ok) {
      console.error('Dispatch failed', { status: res.status, data })
      process.exit(1)
    }

    console.log('Dispatch ok', data)
  } catch (err) {
    console.error('Dispatch error', err)
    process.exit(1)
  }
}

main()
