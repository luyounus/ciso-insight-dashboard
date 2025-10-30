# 🧠 CISO Insight Dashboard

[![Framework: Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Styling: TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38BDF8.svg)](https://tailwindcss.com/)
[![Data: Faker](https://img.shields.io/badge/Data-Faker-orange.svg)](https://fakerjs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **security analytics dashboard** designed for CISOs and security leaders to visualize GitHub Pull Request (PR) risk trends across repositories — including severity distribution, PR lifecycle status, and long-term metrics.

Built for clarity, not complexity: it models how a CISO or head of security could **triage developer activity**, **spot risky code patterns**, and **plan strategic remediations** using PR-level analytics.

---

## 🧭 Overview

This project simulates a **Security PR Bot analytics platform**:
- Generates **mock GitHub data** (repositories, PRs, findings, bot + developer comments)
- Visualizes **risk distribution**, **status breakdown**, and **trend analytics**
- Supports **multi-level drill-down**: from high-level summary → PR list → detailed comments

[Features](#features) •
[Architecture](#architecture) •
[Usage](#usage) •
[Plan & Process](#plan--process) •
[Implementation Decisions](#implementation-decisions) •
[Trade-offs & Rationale](#trade-offs--rationale)

---

## ✨ Features

- 📊 **CISO Dashboard View**
  - KPIs: Open / Merged PRs, Repositories, Contributors
  - Severity and Status charts
  - Open vs. Merged trends over time

- 💬 **Pull Request Library**
  - Filterable PR list by severity
  - Developer + Bot comment simulation
  - Drill-in detail view (PR metadata, risk summary, threaded discussion)

- 🧪 **Fake Data Generator**
  - Seed script using `@faker-js/faker`
  - Outputs GitHub-like JSON models (repositories, PRs, comments, findings)

- ⚙️ **Componentized Architecture**
  - Modular React components for each visualization (KPI Cards, Charts, Tables)
  - Service layer (`fakeCisoInsightApi`) mimicking API fetch calls
  - Easy swap to real GitHub REST APIs later

---

## 🏗 Architecture

**Stack:**
- Framework: **Next.js (App Router)**  
- Language: **TypeScript**
- Styling: **Tailwind CSS**
- Visualization: **Recharts**
- Tables: **TanStack React Table**
- Mock Data: **Faker.js**

**Structure:**
```
src/
  app/
    layout.tsx           # Global shell + nav
    page.tsx             # Overview (KPIs, charts, trend)
    prs/
      page.tsx           # PRs table + filter
      [id]/page.tsx      # PR details (summary, findings, comments)
    repos/page.tsx       # Placeholder
    contributors/page.tsx# Placeholder
  components/
    common/              # KpiCard, SeverityPill
    dashboard/           # DashboardSummary, SeverityDonut, StatusBar, OpenVsMergedTrend
    prs/                 # PRsTable, PRDetails
  data/                  # seed.json (generated)
  services/              # fakeCisoInsightApi.ts
  scripts/               # seedCisoInsight.ts (faker)
  types/                 # github.ts (models)
```

---

## 🚀 Usage

Requirements: Node 18.18+ (Node 20 LTS recommended)

Install deps and seed data:

```bash
npm install
npx tsx src/scripts/seedCisoInsight.ts
```

Run locally:

```bash
npm run dev
# open http://localhost:3000
```

Pages to explore:
- `/` Overview dashboard
- `/prs` PRs table with severity filter
- `/prs/[id]` PR details (findings, comments)

---

## 🧪 Data generation (not checked into git)

This repo does not commit `src/data/seed.json` so that each user can generate fresh data locally.

Generate data any time:

```bash
npx tsx src/scripts/seedCisoInsight.ts
```

What it creates:
- `src/data/seed.json` containing repositories, contributors, and pull requests with
  risk summaries, findings, and threaded comments (bot + developer).

Notes:
- The generator is deterministic via a fixed faker seed; re-running will refresh values while
  keeping distributions realistic.
- If the dev server doesn’t pick up changes to `seed.json`, stop and restart `npm run dev`.
- You can tweak volumes (repo/PR counts) inside `src/scripts/seedCisoInsight.ts`.

---

## 🔌 Data Layer

- `src/services/fakeCisoInsightApi.ts` reads `src/data/seed.json` and exposes:
  - `fetchRepositories`, `fetchPullRequests`, `fetchPullRequestById`, `fetchDashboardSummary`
- `seedCisoInsight.ts` produces:
  - repositories (metadata)
  - contributors
  - pullRequests with `riskSummary`, `findings`, and bot/dev comments
- Types are in `src/types/github.ts` and mirror GitHub-ish shapes while remaining pragmatic for UI needs.

---

## 🎨 UX & Visuals

- Light theme forced; white page background and dark text.
- Cohesive palette for charts (purple/blue family) and a donut for severity distribution.
- Global padding added around the layout for breathing room.

---

## 📊 Data shown and GitHub field origins

What powers each widget:
- **Severity Donut**: derived metric from the bot (`riskSummary.overallSeverity`) – not a native GitHub field.
- **Status Bars**: counts of PR `state` with GitHub’s `merged_at/merged` mapped to UI `state: "merged"`.
- **Trend**: monthly buckets from `created_at` and `merged_at`.
- **KPIs**: totals computed from PR list; repository and contributor counts from repos and authors.

GitHub naming alignment (edge) → UI model (inside):
- Added GitHub-native types: `GithubPullRequest`, `GithubUser`, `GithubRepoRef` with snake_case: `id`, `number`, `title`, `state` ("open" | "closed"), `user`, `created_at`, `updated_at`, `merged_at`, `additions`, `deletions`, `changed_files`, `base.repo`/`head.repo`.
- Normalizer maps to UI camelCase: `created_at → createdAt`, `changed_files → changedFiles`, `user.login → author`, `base/head.repo.id → repoId`, and closed+merged → `state: "merged"`.
- GitHub URLs: `html_url → htmlUrl` and surfaced in UI (PR list and details).

Docs for reference:
- List Pull Requests: `https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests`
- About Pull Requests: `https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#about-pull-requests`

---

## 🔄 Future API integration (batch vs stream)

- **Batch/backfill**
  - Use “List pull requests” per repo with pagination (filter by `state`, `sort=updated`).
  - Periodic jobs (e.g., every 5–10 min) pull deltas since last `updated_at`.
  - Great for initial population and recomputing aggregates.

- **Stream/incremental**
  - Subscribe to webhooks: `pull_request`, `pull_request_review`, `issue_comment`, `push`.
  - Normalize events into the same UI model and update aggregates in near real time.
  - Prefer stream for freshness; keep batch as safety net.

Data flow: GitHub JSON → normalize → enrich with bot `riskSummary` → cache/store → UI.

---

## ✅ Commit Checklist

- [x] Scaffold pages and components
- [x] Seed script and generated `src/data/seed.json`
- [x] Fake API wired to charts and KPIs
- [x] PR details with findings and comments

Suggested initial commit message:

```
feat: scaffold CISO dashboard, seed data, fake API, charts and PR details

- Add overview with KPIs, severity donut, status bars, trend
- Add PRs table + severity filter and PR details route
- Implement faker seed (repos, contributors, PR riskSummary/findings/comments)
- Wire fake API service; update types; light theme + padding
```

---

## 📝 Notes & Trade-offs

- Charts use Recharts; labels/legends optimized for quick scanning.
- Data is deterministic when the faker seed is held constant; re-run seeding to refresh.
- Repo and contributors pages are placeholders; can be expanded to lists and detail views.
