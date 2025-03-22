import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";

const debug = false;
function debugLog(...args: any[]) {
  if (debug) {
    console.log(...args);
  }
}

debugLog("main.tsx");
debugLog(window.location.pathname);

const mdxModules = import.meta.glob("../website/pages/**/*.mdx", {
  eager: true,
});
debugLog(mdxModules);

const normPath = window.location.pathname
  .replace("/index.html", "")
  .replace("//$/", "");
const mdxPath = normPath + (normPath.endsWith("/") ? "index" : "") + ".mdx";
const mdxModulePath = "../website/pages" + mdxPath;
debugLog(normPath, mdxPath, mdxModulePath);
// / -> /index.mdx
// /example/ -> /example/index.mdx
// /example-blog -> /example-blog.mdx || /example-blog/index.mdx || /index.mdx
const mdxModule =
  mdxModules[mdxModulePath] ||
  mdxModules[mdxModulePath.replace(".mdx", "/index.mdx")] ||
  mdxModules["../website/pages/index.mdx"];
debugLog({ normPath, mdxModulePath, mdxModule });

const MDXContent = mdxModule.default;

// Import all components to make them available to MDX files
const componentModules = import.meta.glob("../website/components/*.tsx", {
  eager: true,
});
const components: Record<string, React.ComponentType<any>> = {};

// Extract component names from file paths and add them to the components object
Object.entries(componentModules).forEach(([path, module]) => {
  const componentName =
    path
      .split("/")
      .pop()
      ?.replace(/\.tsx$/, "") || "";
  if (componentName && "default" in module) {
    components[componentName] = (module as any).default;
  }
});

debugLog(components);

// we might want to eventually react-router-ify this
// don't need it for now but could be nice

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MDXContent components={components} />
  </React.StrictMode>
);
