# Handoff Checklist

This checklist prepares the app for hosting on Vercel and handoff to ops.

- [ ] Confirm repository is pushed to GitHub and branch protection is configured.
- [ ] Ensure `package.json` scripts: `dev`, `build`, `preview`, `lint`, `test` are accurate.
- [ ] Vercel settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment variables: (none required for static site; add if using APIs)
- [ ] Add DNS records and configure custom domain in Vercel.
- [ ] Confirm SSL (Vercel provides automatic TLS).
- [ ] Add environment secrets in Vercel (if any): e.g., `API_KEY`, `ANALYTICS_ID`.
- [ ] Confirm CI passes on main branch (`.github/workflows/ci.yml`).
- [ ] Run final build locally: `npm run build` and verify `dist/` content.
- [ ] Run smoke test on deployed URL.

Optional:
- Add analytics and privacy policy link.
- Configure redirects in `vercel.json` if needed.

