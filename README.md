# FOOTFALL Website

Remote: https://github.com/UsmanMuneer15/foot-fall

The Next.js app is in `footfall/`.

## Local development

```bash
cd footfall
npm install
npm run dev
```

Website: http://localhost:3000

## Vercel (required settings)

Open the project → **Settings → General / Build & Development Settings**:

| Setting | Value |
|---|---|
| **Root Directory** | `footfall` |
| Framework Preset | Next.js |
| Install Command | *default* (`npm install`) — clear any override |
| Build Command | *default* (`npm run build`) — clear any override |
| Output Directory | *default* — leave empty / not overridden |

Do **not** use `--prefix footfall` or copy `.next` from the repo root. With Root Directory = `footfall`, Vercel already builds inside that folder.
