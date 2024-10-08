import type { UserConfig } from 'vite'
import { one } from 'one/vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default {
  plugins: [
    one({
      web: {
        deploy: 'vercel',
        defaultRenderMode: 'ssg',
      },
      app: {
        key: 'One',
      },
      deps: { '@tanstack/react-query': true, '@tanstack/react-virtual': true }
    }),

    tamaguiPlugin({
      optimize: true,
      components: ['tamagui'],
      config: './config/tamagui.config.ts',
      outputCSS: './code/styles/tamagui.css',
    }),
  ],
} satisfies UserConfig
