# FOOTFALL Website

Monorepo remote: https://github.com/UsmanMuneer15/foot-fall

The Next.js website lives in the `footfall/` folder.

## Local development

```bash
cd footfall
npm install
npm run dev
```

Website: http://localhost:3000

## Vercel deployment

In **Project Settings → Build and Deployment**:

1. **Root Directory** → `footfall` (keep this)
2. **Install Command** → leave empty / default (`npm install`)
3. **Build Command** → leave empty / default (`npm run build`)

Do **not** use `--prefix footfall` when Root Directory is already `footfall`.
