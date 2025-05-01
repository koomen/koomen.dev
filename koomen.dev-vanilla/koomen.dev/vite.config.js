import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'   // MDX → JSX → JS

export default defineConfig({
  plugins: [
    react(),
    mdx({ providerImportSource: '@mdx-js/react' }) // needed for <Button/> etc.&#8203;:contentReference[oaicite:5]{index=5}
  ]
})