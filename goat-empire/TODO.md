# 📋 TODO — GOAT Royalty Empire

> Agents: work ONLY on `[ ]` items. Mark `[x]` when done. Do not touch `DONE.md` items.
> Work top-down by priority.

---

## 🔴 P1 — Critical (Must-have)

### Real LLM Integration
- [ ] Install Ollama on Server 1 (93.127.214.171)
- [ ] Pull `gemma2:2b` (uncensored variant) as default model
- [ ] Pull `qwen2.5:3b` as fallback
- [ ] Wire Super GOAT app's LLM chat UI to real Ollama endpoint (replace simulated responses in `src/renderer/app.js` → `sendChat()`)
- [ ] Expose Ollama API at `http://93.127.214.171:11434` behind Nginx reverse proxy + auth
- [ ] Add environment variable `GOAT_LLM_URL` in Settings module

### Server Deployments
- [ ] SSH access confirmed for Server 1 (93.127.214.171) — need new password after rotation
- [ ] SSH access confirmed for Server 2 (72.61.193.184) — need new password after rotation
- [ ] Generate SSH key pair, add public key to both servers
- [ ] Install Node 20 + PM2 + Nginx on Server 1
- [ ] Deploy Super GOAT app download page at `https://93.127.214.171/` (or domain)
- [ ] Install Let's Encrypt SSL cert (requires domain pointed at server)
- [ ] Configure Traefik on Server 2 for gaming services
- [ ] ❓ **NEED CLARIFICATION** — What exactly for Server 2? FiveM / FXServer? txAdmin? QBCore? ESX? GTA6 mod pack?

### Real Catalog Data Integration
- [ ] User to upload Excel files to this sandbox: ASCAP_1.xlsx, Catalog_Metadata_BSM.xlsx, iSRC_QZ-9EM-17.xlsx, Music_Reports_WAKA.xlsx, Speedy_Splits.xlsx, FASTASSMAN_MLC.csv, HARVEY_MILLER.csv
- [ ] Parse each Excel/CSV with pandas → JSON
- [ ] Clean WAKA ASCAP 5,694 rows (strip Unnamed columns, normalize schema)
- [ ] Merge all into `data/processed/unified-catalog.json`
- [ ] Wire Royalty Tracker module to load real catalog instead of hardcoded demo rows
- [ ] Add search + filter UI over catalog

### Auth
- [ ] Supabase project setup — create project, get URL + anon key
- [ ] Wire Supabase auth (email + social) into Settings module
- [ ] Remove/replace demo-auth fallback

---

## 🟡 P2 — Integration Add-ons

- [ ] NVIDIA NIM / DGX client — wire to LLM module as alternate backend
- [ ] NVIDIA Riva Speech — voice input/output in LLM chat
- [ ] Lightning AI model router — deploy + connect
- [ ] Liberdus crypto payment rail — wire to Bill Payments module
- [ ] Jetson deployment scripts — test + document
- [ ] Unreal Engine Avatar / Copilot backend — API bridge
- [ ] Wallet Tracker — add module + UI (currently missing from 9-module set)
- [ ] Real crypto mining backend — replace demo mining data with live pool stats
- [ ] Bill Payments module — add to sidebar + wire Stripe/Liberdus
- [ ] Token Swap module — add to sidebar, integrate DEX aggregator
- [ ] Shopify Cart — add products, wire to web-commerce app
- [ ] DSP Distribution — real Spotify/Apple/YouTube API keys + push flow
- [ ] Sync Licensing UI — build module, wire sync opportunities data
- [ ] Decentralized Messaging — add module, use XMTP or Waku
- [ ] RAG System — wire Ollama + catalog data for context-aware answers
- [ ] Video Editor — replace demo timeline with real FFmpeg-backed editor
- [ ] Voice Manager — connect Web Speech API + Riva
- [ ] Local LLM routes — expose Ollama behind app API

---

## 🟢 P3 — Business / Content

- [ ] Build actual Investor Deck (PDF + HTML version) from INVESTOR_PRESENTATION_PLAN.md
- [ ] Legal pages: Terms, Privacy, DMCA, Royalty Agreement
- [ ] Ms. Vanessa Fingerprint feature — spec out + implement
- [ ] GOAT Force episode pages (from storyline PDF)
- [ ] Moneypenny / Codex integration spec + MVP
- [ ] Apply Flying GOAT branding consistently across all apps
- [ ] Roadmap page — Phases 2, 3, 4 content

---

## 🎮 P4 — Gaming Server (Server 2 — 72.61.193.184)

Waiting on user clarification. Once specified:
- [ ] Install selected framework (FiveM / FXServer / txAdmin / custom)
- [ ] Configure Docker containers + Traefik routing
- [ ] Domain + SSL
- [ ] Admin panel setup
- [ ] Link to main GOAT account system (single sign-on)

---

## 🔧 P5 — DevOps / Quality

- [ ] CI/CD: GitHub Actions workflow to auto-build desktop app on push
- [ ] Auto-publish releases on tag push
- [ ] Dependabot for package.json
- [ ] Linting + Prettier config
- [ ] End-to-end tests with Playwright
- [ ] Code signing for Windows EXE + macOS DMG (requires certificates)