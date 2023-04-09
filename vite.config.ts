import react from '@vitejs/plugin-react-swc'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import { viteDelDev } from './vite.del-dev'
import { vitePluginPreload } from './vite.preload'
import { replaceCodePlugin } from 'vite-plugin-replace'
import fs from 'fs'

export default defineConfig(({ command }) => {
  const prePlugins =
    command === 'serve'
      ? [
          copy({
            hook: 'buildStart',
            verbose: false,
            targets: [
              {
                src: 'public/*',
                dest: 'dist',
              },
            ],
          }),
        ]
      : [viteDelDev()]

  const introduction = fs.readFileSync('./introduction.md', {
    encoding: 'utf-8',
  })

  return {
    base: './',
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
      ],
    },
    plugins: [
      ...prePlugins,
      replaceCodePlugin({
        replacements: [
          {
            from: '__INTRODUCTION__',
            to: `\`${introduction.replace(/`/g, '\\`')}\``,
          },
        ],
      }),
      vitePluginPreload(
        './src/preload.ts',
        command === 'serve' ? 'buildStart' : 'writeBundle'
      ),
      react(),
    ],
  }
})

