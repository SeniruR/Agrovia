import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import gracefulFs from 'graceful-fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

gracefulFs.gracefulify(fs)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'lucide-react',
      'socket.io-client',
      '@mui/material',
      '@mui/utils',
      '@react-leaflet/core',
      '@heroicons/react/24/outline',
      '@tiptap/core',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-image',
      '@tiptap/extension-bold',
      'react-select',
      'crypto-js/md5',
      '@babel/runtime/helpers/esm/extends',
      'recharts'
    ],
  },
  resolve: {
    alias: {
      'socket.io-client': path.resolve(__dirname, 'node_modules/socket.io-client/dist/socket.io.js'),
  '@react-leaflet/core': path.resolve(__dirname, 'node_modules/@react-leaflet/core/lib/index.js'),
      '@tiptap/core': path.resolve(__dirname, 'node_modules/@tiptap/core/dist/index.js'),
      '@tiptap/react': path.resolve(__dirname, 'node_modules/@tiptap/react/dist/index.js'),
      '@tiptap/starter-kit': path.resolve(__dirname, 'node_modules/@tiptap/starter-kit/dist/index.js'),
      '@tiptap/extension-image': path.resolve(__dirname, 'node_modules/@tiptap/extension-image/dist/index.js'),
  '@tiptap/extension-blockquote': path.resolve(__dirname, 'node_modules/@tiptap/extension-blockquote/dist/index.js'),
  '@tiptap/extension-bold': path.resolve(__dirname, 'node_modules/@tiptap/extension-bold/dist/index.js'),
  '@mui/utils/composeClasses': path.resolve(__dirname, 'node_modules/@mui/utils/esm/composeClasses/composeClasses.js'),
  '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material/esm'),
      'react-select': path.resolve(__dirname, 'node_modules/react-select/dist/react-select.esm.js'),
      '@babel/runtime/helpers/esm/extends': path.resolve(__dirname, 'node_modules/@babel/runtime/helpers/esm/extends.js'),
      'recharts': path.resolve(__dirname, 'node_modules/recharts/es6/index.js')
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api/v1': 'http://localhost:5000'
    }
  }
})
