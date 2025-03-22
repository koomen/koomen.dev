This document specifies a software project with goals, requirements, structure, tools / libraries to use, and user stories.

We want to make an MDX + React-enabled static site editor / generator system, enabling an easy MDX + React Component editing workflow.

Use Vite, React, TypeScript, Tailwind CSS, and MDX.

Use TailwindCSS v4. Do not use autoprefixer or postcss. Do not create a tailwind.config.js or a postcss.config.js file.
The only css file should be a global.css which does `@import "tailwindcss";`.

Use the following vite plugins: @vitejs/plugin-react, @mds-js/rollup, @tailwindcss/vite

We will generate static HTML (SSG) to serve from a static host; there will be no server-side rendering or dynamic server.

To achieve multiple entrypoints and resulting html files, use this vite plugin: https://github.com/emosheeep/vite-plugin-virtual-mpa

You'll probably need to combine this plugin with some import.meta.glob usage in vite.config.ts or in main.tsx, to find all the .mdx files to turn into entrypoints.

Pay special attention to whether Vite + this combo of plugins will be capable of meeting the other requirements listed here.

Create as few files as possible. Keep things consolidated. Only one entrypoint main.tsx, and only one html file template.html.

The website/ directory should only contain components, mdx files, and static assets.

Keep all details related to Vite and the build system in the system/ directory.

We want the directory structure to look like this:

```
my-project/
├─ system/
|  ├─ node_modules/
│  ├─ template.html
│  ├─ main.tsx
│  ├─ global.css
│  ├─ vite.config.ts
│  ├─ package.json
│  ├─ package-lock.json
│  └─ tsconfig.json
└─ website/
   ├─ public/
   │   ├─ favicon.ico
   │   └─ image.png
   ├─ components/
   │   ├─ Counter.tsx
   │   └─ Button.tsx
   └─ pages/
      ├─ index.mdx
      ├─ example-one.mdx
      └─ example-dir/
         └─ example-two.mdx
```

and then `npm run build` should build to a dist/ directory like:

```
dist/
│  index.html        # from website/pages/index.mdx -> route "/"
├─ example-one/
│   └─ index.html    # from website/pages/example-one.mdx
└─ example-dir/
    └─ example-two/
       └─ index.html # from website/pages/example-dir/example-two.mdx
```

Then a non-technical person editing the site can just run `npm install` and `npm run build` to generate the static website.
They will only need to make changes to the website/ directory, and can easily add pages/new-page.mdx to make a new page.

When someone is editing the site or building a new page, we want the following to be true:

- Only create or modify files in the website/ directory.
- No need to edit anything in the system/ directory.
- Put React components in the website/components/ directory.
- Put .mdx files in the website/pages/ directory.
- No need to create any additional directories - just use website/components/, and website/pages/, and website/public/.
- Keep each React component self-contained in its own single file.
- Each .mdx file becomes a static route, so website/pages/example-one.mdx becomes a /example-one/ route.
- Avoid writing any custom or shared CSS. Just use Tailwind self-contained within each component.
- No need to think about React Router, Tailwind setup, build system, etc. Everything just works as simply as possible.
