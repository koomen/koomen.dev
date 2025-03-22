import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import Inspect from "vite-plugin-inspect";
import { createMpaPlugin, createPages } from "vite-plugin-virtual-mpa";

interface MdxFile {
  relativePath: string;
  fullPath: string;
  outputPath: string;
}

function findMdxFiles(dir, baseDir?): MdxFile[] {
  if (!baseDir) baseDir = dir;
  const entries = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      entries.push(...findMdxFiles(fullPath, baseDir));
    } else if (file.endsWith(".mdx")) {
      const relativePath = path.relative(baseDir, fullPath);
      const routePath = relativePath
        .replace(/\.mdx$/, "")
        .replace(/index$/, "");
      const outputPath = path.join(routePath, "index.html");
      entries.push({
        fullPath,
        relativePath,
        outputPath,
      });
      console.log(relativePath, routePath, outputPath);
    }
  }

  return entries;
}

const mdxFiles = findMdxFiles(path.resolve(__dirname, "../website/pages"));
const pages = mdxFiles.map(({ relativePath, fullPath, outputPath }) => ({
  name: relativePath.replace("/", "-").replace(".mdx", ""),
  filename: outputPath as `${string}.html`,
  entry: "/main.tsx" as `/${string}`,
  data: {
    title: "Title", // TODO: can we make this dynamic off mdx frontmatter?
  },
}));

export default defineConfig({
  root: __dirname,
  base: "/", // this is default, just making explicit in case we ever want different
  appType: "custom",
  publicDir: "../website/public",
  plugins: [
    { enforce: "pre", ...mdx() },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    tailwindcss(),
    createMpaPlugin({
      pages: createPages(pages),
    }),
    Inspect(),
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: { port: 4321 },
  preview: { port: 4321 },
});
