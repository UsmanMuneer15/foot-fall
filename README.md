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

**Important:** In the Vercel project settings, set:

- **Root Directory** → `footfall`

Path: Project Settings → General → Root Directory → `footfall` → Save

Then redeploy. Without this, Vercel looks for `app/` at the repo root and the build fails.
