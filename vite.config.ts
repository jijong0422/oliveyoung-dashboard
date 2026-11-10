import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// AI Studio 프리뷰(Cloud Run 프록시) 환경에서 @vite/client의 불필요한 WebSocket 연결 시도 및
// 'WebSocket closed without opened' 에러/Unhandled Rejection을 원천 차단하는 플러그인
function disableViteHmrWebSocketPlugin(): Plugin {
  return {
    name: 'disable-vite-hmr-websocket',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('vite/dist/client/client.mjs')) {
        return {
          code: code
            .replace(
              /transport\.connect\(createHMRHandler\(handleMessage\)\);?/g,
              '/* HMR WebSocket connection disabled for Cloud Run preview */'
            )
            .replace(
              /reject\(new Error\("WebSocket closed without opened\."\)\)/g,
              'resolve()'
            ),
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), disableViteHmrWebSocketPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      ws: false as const,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
