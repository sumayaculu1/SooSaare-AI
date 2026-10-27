# SooSaare AI deployment

## Repository safety

- Push the repository root to GitHub. The Vercel project root should be `frontend`.
- `node_modules`, build output, `.vercel`, local `.env` files, and local credentials are ignored by the root `.gitignore`.
- Commit the `.env.example` files only. They contain placeholders and local development defaults, not credentials.
- Keep the Gemini key in the backend host's environment settings (or a local backend `.env` file). Never define it as a Vercel frontend variable.

## Deploy the frontend to Vercel

1. Import the GitHub repository into Vercel and set **Root Directory** to `frontend`.
2. Use the Vite framework preset, build command `npm run build`, and output directory `dist`.
3. Add the Vercel project environment variable `VITE_API_URL` with the public HTTPS URL of the separately deployed backend, for example `https://YOUR-BACKEND-URL`.
4. Redeploy after changing environment variables. Vercel provides HTTPS for the deployed frontend automatically.

`VITE_API_URL` is public frontend configuration; it must contain only the backend base URL, never a secret. For local development, `frontend/.env.local` can set `VITE_API_URL=http://localhost:5000`. Without a configured URL, production builds show a configuration error instead of silently calling localhost.

## Deploy the backend

Deploy `backend/backend` to a Node.js service that supports a long-running Express server. Set these server-side environment variables in that host:

- `GEMINI_API_KEY`: the private Gemini API key.
- `FRONTEND_URL`: the exact Vercel origin, such as `https://YOUR-PROJECT.vercel.app`. The backend accepts comma-separated exact origins when more than one frontend origin is required.
- `PORT`: set this only if required by the backend host; the server defaults to port `5000` locally.

The backend's CORS policy allows the configured `FRONTEND_URL` and local development origins. Verify `GET /api/health` and a real `POST /api/generate` after deployment. The backend must use HTTPS when serving a Vercel HTTPS frontend to avoid mixed-content blocking.

## Local development

1. Copy `backend/backend/.env.example` to `backend/backend/.env` and set the real Gemini key there.
2. Start the backend from `backend/backend` with `npm start`.
3. Start the frontend from `frontend` with `npm run dev`.
4. Keep `frontend/.env.local` set to `VITE_API_URL=http://localhost:5000`.
