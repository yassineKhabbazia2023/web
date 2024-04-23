import { nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach, type SpyInstance } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { mockedEnvVars } from '@/../vitest.setup'
import type { LaunchCardProps } from '@/components/launchCard/LaunchCardTypes'
import { LAUNCHER_KEY } from './HomeTypes'
import * as HomeUtils from './HomeUtils'
import Home from '.'

vi.mock('./HomeUtils', async () => {
  return await vi.importActual('./HomeUtils')
})

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

function getLaunchCardComponent(wrapper: VueWrapper, key: LAUNCHER_KEY) {
  return wrapper
    .findComponent(`[data-testid="launch-card-${key}"]`) as unknown as VueWrapper
}

function getLaunchCardComponents(wrapper: VueWrapper) {
  return wrapper
    .findAllComponents('[data-testid^="launch-card-"]')
}

describe('test Home', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = getWrapper()
  })

  describe('default display', () => {
    it('proper launchCards length', async () => {
      await nextTick()
      const launchCards = getLaunchCardComponents(wrapper)

      expect(launchCards).toHaveLength(CARDS_LENGTH)
    })

    it('proper Meg launchCard attributes', () => {
      const megLaunchCard = getLaunchCardComponent(wrapper, LAUNCHER_KEY.meg)
      const expectedAttributes = {
        actionLabel: "Se connecter à l'outil de gestion",
        actionUrl: mockedEnvVars.VITE_GESTION_MEG,
        downloadLabel: '',
        imageName: 'iconpulse-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
        title: 'Mon outil de gestion',
      }

      expect(megLaunchCard.props()).toMatchObject(expectedAttributes)
    })

    it('proper silae launchCard attributes', () => {
      const silaeLaunchCard = getLaunchCardComponent(wrapper, LAUNCHER_KEY.silae)
      const expectedAttributes = {
        actionLabel: 'Se connecter à Silae',
        actionUrl: '',
        downloadLabel: 'Télécharger',
        imageName: 'silae-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
        title: 'Silae',
      }

      expect(silaeLaunchCard.props()).toMatchObject(expectedAttributes)
    })

    it('should contain actionUrls', async () => {
      await flushPromises()

      const launchCards = getLaunchCardComponents(wrapper)
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

  describe('when click action on Silae LaunchCard', () => {
    it('should call handleClickAction with proper arguments', () => {
      const key = LAUNCHER_KEY.silae
      const handleClickActionSpy = vi.spyOn(HomeUtils, 'handleClickAction')
      const silaeLaunchCard = getLaunchCardComponent(wrapper, key)

      silaeLaunchCard.vm.$emit('click-action')

      expect(handleClickActionSpy).toHaveBeenCalledOnce()
      expect(handleClickActionSpy).toHaveBeenNthCalledWith(1, key)
    })
  })

  describe('when click downlad on Silae LaunchCard', () => {
    const mockedPercent = 47
    const launcherKey = LAUNCHER_KEY.silae

    let handleDownloadSpy: SpyInstance
    let getSilaeDownloadLabelSpy: SpyInstance
    let silaeLaunchCard: VueWrapper
    beforeEach(() => {
      handleDownloadSpy = vi
        .spyOn(HomeUtils, 'handleDownload')
        .mockImplementation((_key: LAUNCHER_KEY, onSilaeDownloadProgress: (_: number) => void) => {
          onSilaeDownloadProgress(mockedPercent)

          return Promise.resolve()
        })
      getSilaeDownloadLabelSpy = vi.spyOn(HomeUtils, 'getSilaeDownloadLabel')
      silaeLaunchCard = getLaunchCardComponent(wrapper, launcherKey)
    })

    it('should call onClickAction when click on action-download', () => {
      silaeLaunchCard.vm.$emit('click-download')

      expect(handleDownloadSpy).toHaveBeenCalledOnce()
      expect(handleDownloadSpy).toHaveBeenNthCalledWith(1, launcherKey, expect.any(Function))

      expect(getSilaeDownloadLabelSpy).toHaveBeenCalledTimes(2)
      expect(getSilaeDownloadLabelSpy).toHaveBeenNthCalledWith(2, mockedPercent)
    })

    it('should call onClickAction twice once when resolve between two clicks on action-download', async () => {
      silaeLaunchCard.vm.$emit('click-download')
      await flushPromises()
      silaeLaunchCard.vm.$emit('click-download')

      expect(handleDownloadSpy).toHaveBeenCalledTimes(2)
    })

    it('should call onClickAction only once when resolve after two clicks on action-download', () => {
      silaeLaunchCard.vm.$emit('click-download')
      silaeLaunchCard.vm.$emit('click-download')

      expect(handleDownloadSpy).toHaveBeenCalledOnce()
    })
  })
})
