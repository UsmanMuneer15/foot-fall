# FOOTFALL Website

Remote: https://github.com/UsmanMuneer15/foot-fall

The Next.js website lives in the `footfall/` folder. Root scripts exist so Vercel can build from the repository root and still find `.next/routes-manifest.json`.

## Local development

```bash
cd footfall
npm install
npm run dev
```

Website: http://localhost:3000

## Vercel deployment

In **Project Settings → General / Build and Deployment**:

1. **Root Directory** → leave **empty** (repository root). Do **not** set it to `footfall`.
2. **Install Command** / **Build Command** → leave empty so `vercel.json` is used  
   (`npm install --prefix ./footfall`, then build + copy `.next` to the repo root).

If Root Directory is set to `footfall`, clear it and redeploy — that setting is what produces  
`/vercel/path0/.next/routes-manifest.json` missing when the real output is under `footfall/.next`.
