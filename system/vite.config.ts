import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import Inspect from "vite-plugin-inspect";
import { createMpaPlugin, createPages } from "vite-plugin-virtual-mpa";
import matter from "gray-matter";

interface MdxFile {
  relativePath: string;
  fullPath: string;
  outputPath: string;
  frontMatter: Record<string, any>;
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
      
      // Parse frontmatter from the MDX file
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data: frontMatter } = matter(fileContent);
      
      entries.push({
        fullPath,
        relativePath,
        outputPath,
        frontMatter,
      });
      console.log(relativePath, routePath, outputPath, frontMatter);
    }
  }

  return entries;
}

const mdxFiles = findMdxFiles(path.resolve(__dirname, "../website/pages"));
const pages = mdxFiles.map(({ relativePath, fullPath, outputPath, frontMatter }) => ({
  name: relativePath.replace("/", "-").replace(".mdx", ""),
  filename: outputPath as `${string}.html`,
  entry: "/main.tsx" as `/${string}`,
  data: {
    title: frontMatter.title || relativePath.replace(".mdx", ""),
    description: frontMatter.description || "",
    keywords: frontMatter.keywords || "",
    author: frontMatter.author || "",
    ...frontMatter, // Pass all frontmatter to the template
  },
}));

export default defineConfig({
  root: __dirname,
  base: "/", // this is default, just making explicit in case we ever want different
  appType: "custom",
  publicDir: "../website/public",
  plugins: [
    { 
      enforce: "pre", 
      ...mdx({
        // You can add MDX-specific options here if needed
        remarkPlugins: [],
        rehypePlugins: [],
      }) 
    },
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
