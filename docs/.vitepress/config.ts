import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RYDGE Conseil - Front-End Doc',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  ignoreDeadLinks: true,
  base: '/docs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/brand-color.svg',
      dark: '/brand-white.svg',
    },
    siteTitle: 'Front-End Doc',
    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Getting-started',
        link: '/getting-started/',
      },
      {
        text: 'Monorepo',
        link: '/monorepo/',
      },
      {
        text: 'Guidelines',
        link: '/guidelines/',
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
          items: [
            {
              text: 'Structure du Monorepo',
              link: '/monorepo/structure',
            },
            {
              text: 'Imports dans le Monorepo',
              link: '/monorepo/imports',
            },
            {
              text: 'Guidelines et bonnes pratiques',
              link: '/monorepo/best-practices',
            },
          ],
        },
        {
          text: 'Packages',
          items: [
            {
              text: 'App',
              link: '/monorepo/app',
            },
            {
              text: 'Applets',
              items: [
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
              items: [
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
                  items: [
                    {
                      text: 'Histoire',
                      link: '/monorepo/libraries/styleguide/histoire',
                    },
                  ],
                },
                {
                  text: 'Widgets',
                  link: '/monorepo/libraries/widgets/widgets',
                  items: [
                    {
                      text: 'Comment créer un widget',
                      link: '/monorepo/libraries/widgets/how-to-widgets',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      '/guidelines/': [
        {
          text: 'Guidelines et bonnes pratiques',
          link: '/guidelines/',
          items: [
            {
              text: 'Bad code / good Code',
              link: '/guidelines/bad-code-good-code',
            },
            {
              text: 'Tips and tricks',
              link: '/guidelines/tips-and-tricks',
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'devbox', link: 'https://dev.azure.com/FR-TPEME/Pulse/_git/Pulse.Web' },
    ],
  },
})
