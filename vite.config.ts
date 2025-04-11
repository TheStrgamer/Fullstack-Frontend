import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import istanbul from 'vite-plugin-istanbul'

// Add logging to debug the istanbul plugin
console.log('Istanbul plugin is configured with the following options:', {
  include: 'src/*',
  exclude: ['node_modules', 'test/'],
  extension: ['.js', '.ts', '.vue'],
  cypress: true,
});

// Add logging to confirm instrumentation
console.log('Istanbul plugin is active during build and test runs.');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.ts', '.vue'],
      cypress: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: '/'
})
