# Scratch

"Scratch" is a tool and workflow for "scratching out" an idea, page, or blog post with LLM assistance.

Designed to use in Windsurf or Cursor, using MDX + React Components.

Write mainly in Markdown, but sprinkle React components into your post, aided by LLMs.

This repo provides the workflow, and builds the content for static deployment.

## Getting Started

One-time setup:

```
git clone git@gitlab.com:yc-software/engineers/sandbox/scratch.git
cd scratch
npm install
```

Start the dev server, Vite with hot reloading:

```
npm run dev
```

Then visit http://localhost:5173 in your browser.

## How To Scratch

As a writer / editor / scratcher, you only need to look at and edit things in the `website/` directory.

All top-level files and other directories are part of the Scratch system, and you do not need to look at or edit them.

Making a new page:

- Add `website/pages/your-thing.mdx`
- Now it's at http://localhost:5173/your-thing
- Commit and push

## Deployment

This is hosted at https://scratch.ycinside.com, on Cloudflare Pages behind Cloudflare's YC Google auth.

We deploy to Cloudflare Pages via Cloudflare's `wrangler` CLI.

We'll make CI deploy the main branch automatically soon.

For now, to deploy from your local:

**One-time setup:**

- Log in to [Cloudflare](https://dash.cloudflare.com/login).
  - Credentials in 1Password for vendor+cloudflare@ycombinator.com.
- Run `npx wrangler pages project list`
  - It will Oauth you out to Cloudflare
  - Once this is set up, it'll list project `blog-ycinside`

**To Deploy:**

```
npm run deploy
```

## How we got here

Project history notes

We were doing some vite + mdx + tailwind stuff:

```
npm create vite@latest . -y -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install @mdx-js/rollup @types/mdx @mdx-js/react
```

But then I realized I was reinventing half of Astro, so I just grabbed Astro.

Astro gets really close but still isn't quite exactly the minimum thing we want - iterating more from here.

TODO these are inaccurate, need to update further on how we iterated from astro
