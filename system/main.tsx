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

// Define a type for MDX modules
interface MDXModule {
  default: React.ComponentType<{
    components?: Record<string, React.ComponentType<any>>;
  }>;
}

const mdxModules = import.meta.glob<MDXModule>("../website/pages/**/*.mdx", {
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

// Make sure we have a valid MDX module, otherwise use a fallback component
const MDXContent = mdxModule ? mdxModule.default : () => <div>Page not found</div>;

// Import all components to make them available to MDX files
// Define a type for component modules
interface ComponentModule {
  default: React.ComponentType<any>;
}

const componentModules = import.meta.glob<ComponentModule>("../website/components/**/*.tsx", {
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
    components[componentName] = module.default;
  }
});

// Log the components for debugging
debugLog(components);

// we might want to eventually react-router-ify this
// don't need it for now but could be nice

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MDXContent components={components} />
  </React.StrictMode>
);
