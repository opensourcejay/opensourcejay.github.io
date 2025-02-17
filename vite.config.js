import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [
    react(),
    {
      ...copy({
        targets: [
          { src: 'posts/*', dest: 'dist/posts' },
          { src: 'public/images/blog/*', dest: 'dist/images/blog' }
        ],
        hook: 'writeBundle'
      })
    }
  ],
  base: '/',
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      external: ['**/*.md']
    }
  }
})