# AI Tools Platform

A collection of micro AI tools — plus a no-code builder so users can create their
own — powered by the [NVIDIA NIM API](https://build.nvidia.com) and built with
[Next.js](https://nextjs.org) (App Router) and Tailwind CSS.

## Features

- **12 built-in tools** — bio generator, Twitter thread maker, cold email writer,
  headline generator, meeting summarizer, resume bullet rewriter, weekly planner,
  ELI5 explainer, regex generator, SQL query builder, code reviewer, and git
  commit message writer.
- **Build your own tool** — a visual builder (`/tools/new`) lets anyone create a
  custom AI tool with a live preview, icon/color pickers, and configurable
  inputs. Custom tools are saved in the browser (localStorage) and can be run,
  edited, or deleted — no account needed.
- **Server-side API key** — all model calls go through a `/api/nvidia` proxy, so
  the API key stays on the server and is never exposed to the browser.
- **Polished UI** — token-driven design system with light/dark mode, rich
  markdown output, and syntax-highlighted code blocks.

## Environment variables

| Variable          | Required | Default                                                  | Description                                  |
| ----------------- | -------- | -------------------------------------------------------- | -------------------------------------------- |
| `NVIDIA_API_KEY`  | ✅ Yes   | —                                                        | Your NVIDIA NIM API key (server-side only).  |
| `NVIDIA_BASE_URL` | No       | `https://integrate.api.nvidia.com/v1/chat/completions`   | Chat completions endpoint.                   |
| `NVIDIA_MODEL`    | No       | `meta/llama-3.1-8b-instruct`                             | Model to use for all tools.                  |

See [`.env.example`](.env.example) for a template.

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and add your key
cp .env.example .env.local   # then edit .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy on Vercel

This app deploys to Vercel with **zero configuration** — Vercel auto-detects
Next.js and runs `next build`. No `vercel.json` is required.

1. Push the repo to GitHub (already done).
2. In [Vercel](https://vercel.com/new), click **Add New → Project** and import
   this GitHub repository.
3. Before deploying, open **Settings → Environment Variables** and add:
   - `NVIDIA_API_KEY` (required) — your key
   - `NVIDIA_BASE_URL` (optional)
   - `NVIDIA_MODEL` (optional)

   Add them to the **Production** (and Preview, if you want) environments.
4. Click **Deploy**.

> **Note:** the build itself succeeds without the key (it's only read at request
> time), but the tools won't return results until `NVIDIA_API_KEY` is set. If you
> add or change env vars after the first deploy, redeploy for them to take effect.

## Tech stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · `next-themes` for dark mode
- `react-markdown` + `react-syntax-highlighter` for rendering AI output
- NVIDIA NIM (OpenAI-compatible) chat completions API
