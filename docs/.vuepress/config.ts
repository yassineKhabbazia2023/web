import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'
import { defineUserConfig } from 'vuepress'

import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)
export default defineUserConfig({
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(/^@root/, path.resolve(__dirname, '../../')),
    },
  },
  title: 'Front-End Docs',
  description: 'Bienvenue dans la documentation du dépôt front-end Web de Pulse.',
  bundler: viteBundler({
    viteOptions: {
      server: {
        open: true,
      },
    },
  }),
  theme: defaultTheme(
    {
      contributors: false,
      logo: '/brand-color.svg',
      logoDark: '/brand-white.svg',
      repo: 'https://dev.azure.com/FR-TPEME/Pulse/_git/Pulse.Web',
      lastUpdated: true,
      navbar: [
        {
          text: 'Getting-started',
          link: '/getting-started/',
        },
        {
          text: 'Monorepo',
          link: '/monorepo/',
        },
      ],
      sidebar: {
        '/getting-started/': [
          {
            text: 'Getting-started',
            link: '/getting-started/',
          },
          {
            text: 'How to doc?',
            link: '/getting-started/how-to-doc',
          },
        ],
        '/monorepo/': [
          {
            text: 'Monorepo',
            link: '/monorepo/',
          },
          {
            text: 'Packages',
            children: [
              {
                text: 'App',
                link: '/monorepo/app',
              },
              {
                text: 'Applets',
                children: [
                  {
                    text: 'Entities',
                    link: '/monorepo/applets/entities',
                  },
                  {
                    text: 'GED',
                    link: '/monorepo/applets/ged',
                  },
                  {
                    text: 'Launcher',
                    link: '/monorepo/applets/launcher',
                  },
                  {
                    text: 'Login',
                    link: '/monorepo/applets/login',
                  },
                  {
                    text: 'Mandate',
                    link: '/monorepo/applets/mandate',
                  },
                  {
                    text: 'Offers-catalog',
                    link: '/monorepo/applets/offers-catalog',
                  },
                ],
              },
              {
                text: 'libraries',
                children: [
                  {
                    text: 'Common',
                    link: '/monorepo/libraries/common',
                  },
                  {
                    text: 'Core',
                    link: '/monorepo/libraries/core',
                  },
                  {
                    text: 'StyleGuide',
                    link: '/monorepo/libraries/styleguide/styleguide',
                    children: [
                      {
                        text: 'Histoire',
                        link: '/monorepo/libraries/styleguide/histoire',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ),
  plugins: [
    searchPlugin({
      maxSuggestions: 5,
      hotKeys: ['s', '/'],
      locales: {
        '/': {
          placeholder: 'Rechercher',
        },
      },
    }),
  ],
})