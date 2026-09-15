# FOOTFALL — main project folder

```
FootFall-web/
├── footfall/   → Website repo (this Git remote)
├── server/     → https://github.com/UsmanMuneer15/footfall-server.git
└── admin/      → https://github.com/UsmanMuneer15/footfall-admin-web.git
```

## Website (this repository)

```bash
cd footfall
npm install
npm run dev
```

http://localhost:3000

## Server (own repo)

```bash
cd server
npm install
npm run db:init
npm run dev
```

http://localhost:4000

## Admin (own repo)

```bash
cd admin
npm install
npm run dev
```

http://localhost:3001
