import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [react()],
  server: {
    proxy: {
      '/api/x': {
        target: 'https://api.x.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/x/, ''),
        configure: proxy => {
          proxy.on('proxyReq', proxyReq => {
            proxyReq.setHeader('Authorization', `Bearer ${env.TWITTER_BEARER_TOKEN}`);
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      // Polyfills for Amplify dependencies
      buffer: 'buffer',
      process: 'process/browser',
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        })
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  }
  };
});


