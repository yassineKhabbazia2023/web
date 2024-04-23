import { describe, expect, it, beforeEach } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { mockedEnvVars } from '@/../vitest.setup'
import type { LaunchCardProps } from '@/components/launchCard/LaunchCardTypes'
import Home from '.'

function getWrapper() {
  return shallowMount(Home, {
    global: {
      stubs: {
        LaunchCard: {
          template: '<div />',
          props: [
            'title',
            'subtitle',
            'imageType',
            'imageName',
            'actionLabel',
            'actionUrl',
            'downloadLabel',
          ],
        },
      },
    },
  })
}

const CARDS_LENGTH = 3

describe('test Home', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = getWrapper()
  })

  describe('default display', () => {
    it('proper launchCards length', () => {
      const launchCards = wrapper.findAll('[data-testid="launchCard"]')

      expect(launchCards).toHaveLength(CARDS_LENGTH)
    })

    it('proper first launchCard attributes', () => {
      const firstLaunchCard = wrapper.findComponent('[data-testid="launchCard"]')
      const expectedAttributes = {
        actionLabel: "Se connecter à l'outil de gestion",
        actionUrl: mockedEnvVars.VITE_GESTION_MEG,
        downloadLabel: '',
        imageName: 'iconpulse-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
        title: 'Mon outil de gestion',
      }

      expect((firstLaunchCard as VueWrapper).props()).toMatchObject(expectedAttributes)
    })

    it('proper second launchCard attributes', () => {
      const firstLaunchCard = wrapper.findAllComponents('[data-testid="launchCard"]').at(1)
      const expectedAttributes = {
        actionLabel: 'Se connecter à Silae',
        actionUrl: '',
        downloadLabel: 'Télécharger',
        imageName: 'silae-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
        title: 'Silae',
      }

      expect((firstLaunchCard as VueWrapper).props()).toMatchObject(expectedAttributes)
    })

    it('should contain actionUrls', async () => {
      await flushPromises()

      const launchCards = wrapper.findAllComponents('[data-testid="launchCard"]')
      const actionUrls = launchCards
        .map((launchCard) => {
          const props = (launchCard as VueWrapper).props() as LaunchCardProps

          return props.actionUrl
        })

      const expectedActionUrls = [
        mockedEnvVars.VITE_GESTION_MEG,
        '',
        mockedEnvVars.VITE_PENNYLANE_SSO_URL,
      ]

      expect(actionUrls).toMatchObject(expectedActionUrls)
    })
  })
})
