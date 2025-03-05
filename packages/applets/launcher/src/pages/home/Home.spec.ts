import { nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { launchCardsMock } from '@launcher/__mocks__/launch-cards.mocks'
import { launcherServicesMocks } from '@launcher/__mocks__/launcher.service.mocks'
import { mockedEntity } from '@launcher/__mocks__/entity.mocks'
import { getLaunchCardsMock, getSilaeDownloadLabelMock, handleClickActionMock, handleDownloadMock, homeUtilsMocks, mockedPercent } from '@launcher/__mocks__/home-utils.mocks'
import { mockHasPermission } from '@launcher/__mocks__/permissions.mocks'
import { envVarsMock } from '@pulse/core/mocks'
import '@launcher/__mocks__/common.import.mocks'
import { LAUNCHER_AUTHORIZATIONS } from '@launcher/common/authorizationConst'
import type { LaunchCardProps } from '@launcher/components/launchCard/LaunchCardTypes'
import { LauncherKey } from './HomeTypes'
import * as VueRouter from 'vue-router'

import Home from '.'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'launcher',
  }),
}))

vi.mock('./HomeUtils', () => homeUtilsMocks)
vi.mock('@launcher/services/launcherServices', () => launcherServicesMocks)

const mockedSilaeDownloadLabel = 'silae download label'

function getWrapper() {
  return shallowMount(Home)
}

const CARDS_LENGTH = 3

function getLaunchCardComponent(wrapper: VueWrapper, key: LauncherKey) {
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
    getLaunchCardsMock.mockReturnValue(launchCardsMock)
    getSilaeDownloadLabelMock.mockReturnValue(mockedSilaeDownloadLabel)
    wrapper = getWrapper()
  })

  describe('default display', () => {
    it('proper launchCards length and breadcrumb elements', async () => {
      await nextTick()
      const launchCards = getLaunchCardComponents(wrapper)
      const PBreadcrumb = wrapper.findComponent({ name: 'PBreadcrumb' })
      const title = wrapper.find('[data-testid="launcher-home-title"]')
      const sectionTitle = wrapper.find('[data-testid="launcher-home-section-title"]')
      const expectedBreadcrumbElements = [{
        pId: -1,
        pText: mockedEntity.legalName,
      }, {
        pId: -1,
        pText: 'Applications',
      }]

      expect(launchCards).toHaveLength(CARDS_LENGTH)
      expect(PBreadcrumb.props('pElements')).toStrictEqual(expectedBreadcrumbElements)
      expect(title.exists()).toBeTruthy()
      expect(sectionTitle.exists()).toBeTruthy()
    })

    it('should display filtered cards', async () => {
      const mockedFiltersLaunchCards = [launchCardsMock.at(0)]
      getLaunchCardsMock.mockReturnValue(mockedFiltersLaunchCards)
      mockHasPermission.mockImplementation((permissions: string[]) =>
        permissions.includes(
          LAUNCHER_AUTHORIZATIONS[2].authorizationCodes[0],
        ),
      )

      const wrapper = getWrapper()
      await flushPromises()
      const launchCards = getLaunchCardComponents(wrapper)
      const noLauncher = wrapper.find('[data-testid="home-no-launcher"]')
      const expectedParams1stCall = [
        LauncherKey.MEG,
        LauncherKey.SILAE,
        LauncherKey.PENNYLANE,
      ]
      const expectedParams2thCall = [
        LauncherKey.PENNYLANE,
      ]

      expect(getLaunchCardsMock).toHaveBeenCalledTimes(2)
      expect(getLaunchCardsMock).toHaveBeenNthCalledWith(1, mockedSilaeDownloadLabel, expectedParams1stCall)
      expect(getLaunchCardsMock).toHaveBeenNthCalledWith(2, mockedSilaeDownloadLabel, expectedParams2thCall)
      expect(noLauncher.exists()).toBeFalsy()
      expect(launchCards).toHaveLength(1)
    })

    it('proper Meg launchCard attributes', () => {
      const megLaunchCard = getLaunchCardComponent(wrapper, LauncherKey.MEG)
      const expectedAttributes = {
        actionLabel: 'Se connecter à l\'outil de gestion',
        actionUrl: envVarsMock.VITE_GESTION_MEG,
        downloadLabel: '',
        imageName: 'brand-color',
        imageType: 'logos',
        subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
        title: 'Mon outil de gestion',
      }

      expect(megLaunchCard.props()).toMatchObject(expectedAttributes)
    })

    it('proper silae launchCard attributes', () => {
      const silaeLaunchCard = getLaunchCardComponent(wrapper, LauncherKey.SILAE)
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
        envVarsMock.VITE_GESTION_MEG,
        '',
        envVarsMock.VITE_PENNYLANE_SSO_URL,
      ]

      expect(actionUrls).toMatchObject(expectedActionUrls)
    })
  })

  describe('when route is launcher-collab', () => {
    it('proper launchCards length and breadcrumb elements', async () => {
      vi
        .spyOn(VueRouter, 'useRoute')
        .mockReturnValueOnce({
          name: 'launcher-collab',
        } as VueRouter.RouteLocationNormalizedLoaded)
      const wrapper = getWrapper()
      await nextTick()
      const launchCards = getLaunchCardComponents(wrapper)
      const PBreadcrumb = wrapper.findComponent({ name: 'PBreadcrumb' })
      const title = wrapper.find('[data-testid="launcher-home-title"]')
      const sectionTitle = wrapper.find('[data-testid="launcher-home-section-title"]')

      expect(launchCards).toHaveLength(CARDS_LENGTH)
      expect(PBreadcrumb.exists()).toBeFalsy()
      expect(title.exists()).toBeFalsy()
      expect(sectionTitle.exists()).toBeFalsy()
    })
  })

  describe('when no launcher app to display', () => {
    it('should display filtered cards', async () => {
      getLaunchCardsMock.mockReturnValue([])
      mockHasPermission.mockImplementation(() => false)
      const wrapper = getWrapper()
      await flushPromises()
      const launchCards = getLaunchCardComponents(wrapper)
      const noLauncher = wrapper.find('[data-testid="home-no-launcher"]')

      expect(getLaunchCardsMock).toHaveBeenCalledTimes(2)
      expect(getLaunchCardsMock).toHaveBeenNthCalledWith(2, mockedSilaeDownloadLabel, [])
      expect(noLauncher.exists()).toBeTruthy()
      expect(launchCards).toHaveLength(0)
    })
  })

  describe('when click action on Silae LaunchCard', () => {
    it('should call handleClickAction with proper arguments', () => {
      const key = LauncherKey.SILAE
      const silaeLaunchCard = getLaunchCardComponent(wrapper, key)

      silaeLaunchCard.vm.$emit('click-action')

      expect(handleClickActionMock).toHaveBeenCalledOnce()
      expect(handleClickActionMock).toHaveBeenNthCalledWith(1, key)
    })
  })

  describe('when click download on Silae LaunchCard', () => {
    const launcherKey = LauncherKey.SILAE

    let silaeLaunchCard: VueWrapper
    beforeEach(() => {
      silaeLaunchCard = getLaunchCardComponent(wrapper, launcherKey)
    })

    it('should call onClickAction when click on action-download', async () => {
      silaeLaunchCard.vm.$emit('click-download')
      await nextTick()

      expect(handleDownloadMock).toHaveBeenCalledOnce()
      expect(handleDownloadMock).toHaveBeenNthCalledWith(1, launcherKey, expect.any(Function))

      expect(getSilaeDownloadLabelMock).toHaveBeenCalledTimes(2)
      expect(getSilaeDownloadLabelMock).toHaveBeenNthCalledWith(1, undefined)
      expect(getSilaeDownloadLabelMock).toHaveBeenNthCalledWith(2, mockedPercent)
    })

    it('should call onClickAction twice once when resolve between two clicks on action-download', async () => {
      silaeLaunchCard.vm.$emit('click-download')
      await flushPromises()
      silaeLaunchCard.vm.$emit('click-download')

      expect(handleDownloadMock).toHaveBeenCalledTimes(2)
    })

    it('should call onClickAction only once when resolve after two clicks on action-download', () => {
      silaeLaunchCard.vm.$emit('click-download')
      silaeLaunchCard.vm.$emit('click-download')

      expect(handleDownloadMock).toHaveBeenCalledOnce()
    })
  })
})
