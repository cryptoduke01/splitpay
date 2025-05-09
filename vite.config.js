import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from 'vite-plugin-node-globals-polyfill'
import { NodeStdlibBrowserPolyfillPlugin } from 'vite-plugin-node-stdlib-browser'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
    NodeStdlibBrowserPolyfillPlugin({
      include: ['buffer']
    }),
  ],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    rollupOptions: {
      output: {
        globals: {
          buffer: 'Buffer'
        }
      }
    }
  }
})
