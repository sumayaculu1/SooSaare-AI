# SooSaare AI on Vercel

## Vercel project settings

- Git repository: `sumayaculu1/SooSaare-AI`
- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `GEMINI_API_KEY` (server-side Vercel environment variable; never prefix it with `VITE_`)

The Vercel project serves the Vite frontend and the functions in `frontend/api/` from one HTTPS origin. The React app calls `/api/health` and `/api/generate` in production. Local development can set `VITE_API_URL=http://localhost:5000` in `frontend/.env.local`.

After adding `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables for Production (and Preview if desired), redeploy. Vercel supplies the deployment origin used by the API's CORS allowlist.

## Local development

1. Install backend dependencies from `backend/backend` with `npm install`.
2. Install frontend dependencies from `frontend` with `npm install`.
3. Copy `backend/backend/.env.example` to `backend/backend/.env` and set the private Gemini key there.
4. Run the backend with `npm start` from `backend/backend`.
5. Run the Vite app with `npm run dev` from `frontend`.
