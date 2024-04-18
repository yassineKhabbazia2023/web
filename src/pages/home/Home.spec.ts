import { describe, expect, it } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
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
            'downloadUrl',
          ],
        },
      },
    },
  })
}

const CARDS_LENGTH = 3

describe('test Home', () => {
  describe('default display', () => {
    const wrapper = getWrapper()
    it('proper launchCards length', () => {
      const launchCards = wrapper.findAll('[data-testid="launchCard"]')

      expect(launchCards).toHaveLength(CARDS_LENGTH)
    })

    it('proper fist launchCards attributes', () => {
      const firstLaunchCard = wrapper.findComponent('[data-testid="launchCard"]')
      const expectedAttributes = {
        actionLabel: "Se connecter à l'outil de gestion",
        downloadUrl: '',
        imageName: 'iconpulse-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
        title: 'Mon outil de gestion',
      }

      expect((firstLaunchCard as VueWrapper).props()).toMatchObject(expectedAttributes)
    })
  })
})
