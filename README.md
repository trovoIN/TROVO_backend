# Trovo Backend (Early Access)

Node + Express API for collecting early access emails into Firestore and sending a welcome email via Nodemailer.

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill Firebase service account + SMTP creds + frontend origin.
4. `npm run dev` (hot reload) or `npm run build && npm start`.

## Endpoints
- `GET /health` – liveness.
- `POST /api/early-access` – body `{ "email": "you@example.com" }`. Validates, writes to `early_access_emails`, tries to send welcome email, marks `status: sent` on success.

## Deployment options
- Firebase Functions (Node 18): wrap `app` with `functions.https.onRequest(app)`.
- Vercel/Netlify/Render/Railway: deploy as a Node/Express service; set env vars in dashboard; allow origin to your domain.
- Cron/worker: if you prefer Firestore triggers, move the email send into an onCreate trigger and remove the inline send from the route.

## Notes
- `FIREBASE_PRIVATE_KEY` often contains escaped newlines; keep the `\n` in env and it will be normalized at runtime.
- SMTP: use a transactional provider (Postmark, SendGrid, Brevo). Gmail often blocks or lands in spam.
- CORS only allows `FRONTEND_ORIGIN`.
