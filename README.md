# SETUP — Your CRT Portfolio

A cinematic, immersive portfolio that feels like powering on an abandoned CRT
monitor. This guide gets you from download to deployed.

---

## 1. Run it locally

You need **Node.js 18+** (Node 20+ recommended).

```bash
npm install      # or: bun install / pnpm install / yarn
npm run dev      # or: bun run dev
```

Open **http://localhost:3000**.

- The screen loads **powered off**. Press any key (or click) to power on.
- Watch the boot sequence. When you see **`SO, WHAT DO YOU FEEL?`**, press **Enter**.
- Navigate the 6 channels with the bottom dock, number keys **1–6**, or **← →**.
- **M** toggles sound. **R** opens a hidden root shell. Konami code
  (↑↑↓↓←→←→ B A) summons the CRT cat.

---

## 2. Make it yours — edit ONE file

**Everything you need to change lives in `src/config/siteConfig.ts`.**

Open it. You'll see big section banners and `// 👈 EDIT` markers on every
personal field. The 8 things most people change:

| # | Field in `siteConfig.ts`        | What it controls                      |
|---|---------------------------------|---------------------------------------|
| 1 | `name`                          | Your name (Hero + About)              |
| 2 | `title`                         | Your role line                        |
| 3 | `hero.lines`                    | The typed lines on the home screen    |
| 4 | `about.bio`                     | Your about-me paragraphs              |
| 5 | `skills.skills`                 | Your skills + proficiency %           |
| 6 | `projects.items`                | Your projects                         |
| 7 | `timeline.entries`              | Your career milestones                |
| 8 | `contact.connections` +         | Your email, GitHub, LinkedIn,         |
|   | `googleCalendarBookingUrl`      | and Google booking link               |

Save the file — the dev server hot-reloads instantly.

> **Tip:** Search the file for `👈 EDIT` to jump to every personal field.

---

## 3. Google Calendar booking (optional)

The **BOOK A MEETING** button on channel 06 embeds your Google Appointment
Schedule page.

1. Go to **Google Calendar → Settings → Scheduling → Appointment schedules**.
2. Create a schedule, add your available slots.
3. Copy the **public booking page URL**
   (looks like `https://calendar.google.com/calendar/appointments/<ID>?gv=true`).
4. Paste it into `googleCalendarBookingUrl` in `src/config/siteConfig.ts`.

When a visitor books a slot, Google **automatically** creates a Calendar event
with a Google Meet link and emails both of you. Your code never touches
scheduling data — it just embeds the page.

If the URL is missing or won't embed, the button falls back to opening the
booking page in a new tab.

---

## 4. Build & deploy

```bash
npm run build     # production build
npm run start     # serve the production build (set PORT to change the port)
```

**Deploy anywhere that runs Next.js** — Vercel, Netlify, Cloudflare Pages,
a VPS, etc. No database is required (the portfolio is 100% static/client-side).

- **Vercel:** push to GitHub, import the repo, deploy. Done.
- **Other hosts:** run `npm run build` then `npm run start`, or use their
  Next.js build preset.

---

## 5. Project structure

```
src/
├─ config/
│  └─ siteConfig.ts        ← ★ EDIT THIS (all your content)
├─ app/
│  ├─ layout.tsx           fonts + metadata
│  ├─ page.tsx             the monitor shell (boot → screens → nav)
│  └─ globals.css          CRT theme + animations
├─ components/
│  ├─ crt/                 the monitor: CRTMonitor, CRTEffects, BootSequence,
│  │                       NavControls, CustomCursor, EasterEggs, …
│  ├─ screens/             the 6 channels + GoogleCalendarBooking
│  └─ shared/              TypewriterText, ScanBar, GlitchText
└─ hooks/                  useCRTStore (state), useSound (Web Audio)
```

---

## 6. Customize further (optional)

- **Change the green color:** edit `theme.green` in `siteConfig.ts`
  (e.g. `"#33FF33"` for a more classic phosphor green, `"#FF6600"` for amber).
- **Rename channels:** edit `channels` in `siteConfig.ts`
  (keep `id` values, change `label`).
- **Tweak CRT effects intensity:** edit `src/app/globals.css`
  (`--scanline-size`, `--flicker-opacity`) and `src/components/crt/CRTEffects.tsx`.
- **Disable easter eggs:** remove `<EasterEggs />` from `src/app/page.tsx`.
- **Turn sound OFF by default:** set `soundOn: false` in
  `src/hooks/useCRTStore.ts`.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| Blank black screen on load | That's intentional — the monitor is "off". Press any key. |
| No sound | Sound is ON by default. Browsers block audio until you click — the power-on click unlocks it. Press **M** to toggle. |
| Port 3000 in use | Edit `package.json`: `"dev": "next dev -p 3001"`. |
| Fonts look wrong | Needs internet (VT323 + Share Tech Mono load from Google Fonts). For offline, install the fonts locally and update `src/app/layout.tsx`. |
| Google booking won't embed | Some Google accounts block iframing. The fallback opens it in a new tab automatically. |

---

Enjoy your machine. — TERMINAL_07
