import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RYDGE Conseil - Front-End Doc',
  head: [['link', { rel: 'icon', href: '/docs/favicon.png' }]],
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
        text: 'Onboarding',
        link: '/onboarding/',
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
        text: 'PLU',
        link: '/plu/structure',
      },
      {
        text: 'Back-Office',
        link: '/backoffice/',
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
      '/onboarding/': [
        {
          text: 'Vue d\'ensemble',
          link: '/onboarding/',
        },
      ],
      '/backoffice/': [
        {
          text: 'Back-Office',
          link: '/backoffice/',
        },
      ],
      '/monorepo/': [
        {
          text: 'Le concept de Monorepo',
          link: '/monorepo/',
        },
        {
          text: 'Imports dans le Monorepo',
          link: '/monorepo/imports',
        },
        {
          text: 'Stack technique',
          link: '/monorepo/stack',
        },
      ],
      '/plu/': [
        {
          text: 'Structure de la PLU',
          link: '/plu/structure',
        },
        {
          text: 'Routing',
          link: '/plu/routing',
        },
        {
          text: 'Experience & Layouts',
          link: '/plu/experience',
        },
        {
          text: 'Packages',
          items: [
            {
              text: 'Customer',
              link: '/plu/customer',
            },
            {
              text: 'Collaborator',
              link: '/plu/collaborator',
            },
            {
              text: 'Applets',
              items: [
                {
                  text: 'Booking',
                  link: '/plu/applets/booking',
                },
                {
                  text: 'Entities',
                  link: '/plu/applets/entities',
                },
                {
                  text: 'Feed Center',
                  link: '/plu/applets/feed-center',
                },
                {
                  text: 'GED',
                  link: '/plu/applets/ged',
                },
                {
                  text: 'Homepage',
                  link: '/plu/applets/homepage',
                },
                {
                  text: 'Launcher',
                  link: '/plu/applets/launcher',
                },
                {
                  text: 'Login',
                  link: '/plu/applets/login',
                },
                {
                  text: 'Mandate',
                  link: '/plu/applets/mandate',
                },
                {
                  text: 'Offers-catalog',
                  link: '/plu/applets/offers-catalog',
                },
                {
                  text: 'Pennylane',
                  link: '/plu/applets/pennylane',
                },
                {
                  text: 'Power BI',
                  link: '/plu/applets/powerbi',
                },
              ],
            },
            {
              text: 'libraries',
              items: [
                {
                  text: 'Toolbox',
                  link: '/plu/libraries/toolbox',
                },
                {
                  text: 'Common',
                  link: '/plu/libraries/common',
                },
                {
                  text: 'Shared',
                  link: '/plu/libraries/shared',
                },
                {
                  text: 'StyleGuide',
                  link: '/plu/libraries/styleguide/styleguide',
                },
                {
                  text: 'Widgets',
                  link: '/plu/libraries/widgets/widgets',
                  items: [
                    {
                      text: 'Comment créer un widget',
                      link: '/plu/libraries/widgets/how-to-widgets',
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
