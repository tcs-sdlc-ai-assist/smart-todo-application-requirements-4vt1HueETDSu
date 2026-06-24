# Deployment Guide – Smart Todo App

---

## Overview

This document describes how to deploy **Smart Todo App** to production, including environment variables, Vercel hosting configuration, and CI/CD notes.

---

## 1. Build & Preview

### Build for Production

```
npm run build
```

- Output: `dist/` directory (static assets)

### Preview Production Build

```
npm run preview
```

- Serves the built app locally for final checks.

---

## 2. Environment Variables

- All environment variables must be prefixed with `VITE_` for Vite to expose them to the client.
- Set variables in `.env.production` or via Vercel dashboard.

**Example:**

```
VITE_API_URL=https://api.example.com
VITE_FEATURE_FLAG_AI=true
```

- Access in code: `import.meta.env.VITE_API_URL`

---

## 3. Vercel Hosting

### Static Hosting

- The app is a pure static SPA (Single Page Application).
- Deploy the `dist/` folder as static assets.

### Vercel Configuration

- `vercel.json` is included in the repo:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

- This ensures SPA routing: all paths serve `index.html`.

### Steps

1. **Connect repo to Vercel**  
   - Import the GitHub repository in Vercel dashboard.

2. **Configure Build Settings**  
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**  
   - Add any `VITE_*` variables in Vercel's Environment Variables UI.

4. **Deploy**  
   - Vercel will build and deploy automatically on push.

---

## 4. CI/CD Notes

- **GitHub Actions**: Not included by default. Vercel handles build/deploy.
- **Vercel Preview Deployments**:  
  - Every branch/pull request gets a preview URL.
  - Production deploys from `main` branch.

- **Testing**:  
  - Run tests locally: `npm run test`
  - Optionally, add a GitHub Actions workflow for PR test runs.

**Example workflow (optional):**

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test
```

---

## 5. Troubleshooting

- **Build errors**: Check Vite logs in Vercel dashboard.
- **Routing issues**: Ensure `vercel.json` is present for SPA rewrites.
- **Environment variables**: Must be set in Vercel and prefixed with `VITE_`.

---

## 6. Production Checklist

- [ ] All tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set in Vercel
- [ ] SPA routing works (deep links, refresh)
- [ ] Accessibility checks (keyboard, ARIA)
- [ ] Responsive UI verified

---

## 7. Feedback & Support

- For deployment issues, check Vercel docs: https://vercel.com/docs
- For app-specific issues, see the Product Roadmap dialog in the app.

---

**Smart Todo App**  
Built with Vite + React  
© All rights reserved