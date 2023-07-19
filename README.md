# electron-starter

> Minimal Electron boilerplate

- Configured TypeScript with Next.js for renderer

  - Main page is in `renderer/pages/index.tsx` file

- Configured TypeScript for Electron main process

- GitHub Action Workflows

  - CI pipeline (build, lint, audit)

  - Manual release for GitHub

- Configured logger

## Getting started

### Prerequisites for release workflow

- Create personal access token (with `repo` and `write:packages` permissions) and set it as GitHub Action secret (`GH_TOKEN`)

### Local setup

```bash
git clone https://github.com/delimitertech/electron-starter
cd electron-starter
npm i
npm run dev
```

### Publishing

Trigger manually release config for GitHub Actions workflow

### Technologies used

- Node.js, TypeScript, Electron, Next.js
