# SooSaare AI on Vercel

## Vercel project settings

- Git repository: `sumayaculu1/SooSaare-AI`
- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `GEMINI_API_KEY` (server-side Vercel variable; never prefix it with `VITE_`)

Vercel serves the Vite frontend and the functions in `frontend/api/` from one HTTPS origin. The React app uses the relative `/api/health` and `/api/generate` endpoints, so production API calls stay on the Vercel origin. Vite's `/api` proxy to `http://localhost:5000` applies only during local development.

Add `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables for Production (and Preview if desired), then redeploy. The `/api/generate` function reads this server-side variable and makes real Google Gemini requests. Do not expose the key through a `VITE_` variable.

## Local development

1. Install backend dependencies from `backend/backend` with `npm install`.
2. Install frontend dependencies from `frontend` with `npm install`.
3. Copy `backend/backend/.env.example` to `backend/backend/.env` and set the private Gemini key there.
4. Run the backend with `npm start` from `backend/backend`.
5. Run the Vite app with `npm run dev` from `frontend`.
