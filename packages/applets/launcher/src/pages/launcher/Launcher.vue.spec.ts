import { nextTick } from 'vue'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { launchCardsMock, collabLaunchCardsMock } from '@launcher/__mocks__/launch-cards.mocks'
import { envVarsMock, getMockedEntitySummary, getHasPermissionMocked, getMockedUserInfo } from '@pulse/common/mocks'
import { hasPermissionMock, getStoreMock } from '@pulse/common/mocks/vitest'
import { LAUNCHER_AUTHORIZATIONS } from '@launcher/common/authorizationConst'
import type { LaunchCardProps } from '@launcher/components/launchCard/LaunchCardTypes'
import { LauncherKey } from './LauncherTypes'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentEntityStore, usePermissionsStore, useUserStore } from '@pulse/common/stores'
import type { Permission } from '@pulse/common/types'
import { CollaboratorPermission } from '@pulse/common/enums'
import { getLaunchCards, getSilaeDownloadLabel, handleClickAction, handleDownload } from './LauncherUtils'

import Launcher from './Launcher.vue'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const userStoreMock = getStoreMock(useUserStore)

const mockedPercent = 47
const mockedSilaeDownloadLabel = 'silae download label'

function getWrapper() {
  return shallowMount(Launcher)
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

const entitySummaryMock = getMockedEntitySummary({
  legalName: 'Entity Test',
})
const currentEntityPermissionsMock: Permission[] = [CollaboratorPermission.CREER_JEUX_DONNEES]

describe('test Home', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    currentEntityStoreMock.currentEntity = entitySummaryMock
    permissionsStoreMock.currentEntityPermissions = currentEntityPermissionsMock
    userStoreMock.user = getMockedUserInfo()

    // Shared vue-router spies are armed per test (doctrine: shared-hubs).
    vi.mocked(useRoute).mockReturnValue({ name: 'launcher' } as unknown as ReturnType<typeof useRoute>)
    vi.mocked(useRouter).mockReturnValue({
      resolve: () => ({ href: '/pennylane-sso-proxy' }),
      hasRoute: () => false,
    } as unknown as ReturnType<typeof useRouter>)

    // LauncherUtils is spy-wrapped (real by default): re-arm the behaviors its
    // legacy module mock used to provide (doctrine: shared-hubs).
    vi.mocked(getLaunchCards).mockReturnValue(launchCardsMock)
    vi.mocked(getSilaeDownloadLabel).mockReturnValue(mockedSilaeDownloadLabel)
    vi.mocked(handleClickAction).mockResolvedValue(undefined)
    vi.mocked(handleDownload).mockImplementation((_key, onSilaeDownloadProgress) => {
      onSilaeDownloadProgress(mockedPercent)
      return Promise.resolve()
    })
    wrapper = getWrapper()
  })

  describe('default display', () => {
    it('proper launchCards length and entity header elements', async () => {
      await nextTick()
      const launchCards = getLaunchCardComponents(wrapper)
      const entityHeader = wrapper.findComponent({ name: 'PEntityHeader' })
      const title = wrapper.find('[data-testid="launcher-home-title"]')
      const sectionTitle = wrapper.find('[data-testid="launcher-home-section-title"]')

      expect(launchCards).toHaveLength(CARDS_LENGTH)
      expect(entityHeader.exists()).toBeTruthy()
      expect(entityHeader.props('pLegalName')).toBe(entitySummaryMock.legalName)
      expect(entityHeader.props('pAccountNumber')).toBe(entitySummaryMock.accountNumber)
      expect(title.exists()).toBeTruthy()
      expect(sectionTitle.exists()).toBeTruthy()
    })

    it('should display filtered cards', async () => {
      const mockedFiltersLaunchCards = launchCardsMock.slice(0, 1)
      vi.mocked(getLaunchCards).mockReturnValue(mockedFiltersLaunchCards)
      hasPermissionMock.mockImplementation(getHasPermissionMocked([LAUNCHER_AUTHORIZATIONS[2].authorizationCodes[0]]))

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

      expect(vi.mocked(getLaunchCards)).toHaveBeenCalledTimes(2)
      expect(vi.mocked(getLaunchCards)).toHaveBeenNthCalledWith(1, mockedSilaeDownloadLabel, expectedParams1stCall, false)
      expect(vi.mocked(getLaunchCards)).toHaveBeenNthCalledWith(2, mockedSilaeDownloadLabel, expectedParams2thCall, false)
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

    it('includes correct actionUrls for collab users', async () => {
      // Arrange
      userStoreMock.user = getMockedUserInfo({ isCollab: true })
      vi.mocked(getLaunchCards).mockReturnValue(collabLaunchCardsMock)

      // Create new wrapper after setting isCollab to true
      const collabWrapper = getWrapper()
      await flushPromises()

      // Act
      const launchCards = getLaunchCardComponents(collabWrapper)
      const actionUrls = launchCards.map((launchCard) => {
        const { actionUrl } = (launchCard as VueWrapper).props() as LaunchCardProps
        return actionUrl
      })

      // Assert
      expect(actionUrls).toEqual([
        envVarsMock.VITE_PENNYLANE_COLLAB_SSO_URL,
      ])
    })
  })

  describe('when route is launcher-collab', () => {
    it('proper launchCards length and entity header elements', async () => {
      vi.mocked(useRoute).mockReturnValueOnce({ name: 'launcher-collab' } as unknown as ReturnType<typeof useRoute>)
      const wrapper = getWrapper()
      await nextTick()
      const launchCards = getLaunchCardComponents(wrapper)
      const entityHeader = wrapper.findComponent({ name: 'PEntityHeader' })
      const title = wrapper.find('[data-testid="launcher-home-title"]')
      const sectionTitle = wrapper.find('[data-testid="launcher-home-section-title"]')

      expect(launchCards).toHaveLength(CARDS_LENGTH)
      expect(entityHeader.exists()).toBeFalsy()
      expect(title.exists()).toBeFalsy()
      expect(sectionTitle.exists()).toBeFalsy()
    })
  })

  describe('when no launcher app to display', () => {
    it('should display filtered cards', async () => {
      vi.mocked(getLaunchCards).mockReturnValue([])
      hasPermissionMock.mockImplementation(() => false)
      const wrapper = getWrapper()
      await flushPromises()
      const launchCards = getLaunchCardComponents(wrapper)
      const noLauncher = wrapper.find('[data-testid="home-no-launcher"]')

      expect(vi.mocked(getLaunchCards)).toHaveBeenCalledTimes(2)
      expect(vi.mocked(getLaunchCards)).toHaveBeenNthCalledWith(2, mockedSilaeDownloadLabel, [], false)
      expect(noLauncher.exists()).toBeTruthy()
      expect(launchCards).toHaveLength(0)
    })
  })

  describe('when click action on Silae LaunchCard', () => {
    it('should call handleClickAction with proper arguments', () => {
      const key = LauncherKey.SILAE
      const silaeLaunchCard = getLaunchCardComponent(wrapper, key)

      silaeLaunchCard.vm.$emit('click-action')

      expect(vi.mocked(handleClickAction)).toHaveBeenCalledOnce()
      expect(vi.mocked(handleClickAction)).toHaveBeenNthCalledWith(1, key)
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

      expect(vi.mocked(handleDownload)).toHaveBeenCalledOnce()
      expect(vi.mocked(handleDownload)).toHaveBeenNthCalledWith(1, launcherKey, expect.any(Function))

      expect(vi.mocked(getSilaeDownloadLabel)).toHaveBeenCalledTimes(2)
      expect(vi.mocked(getSilaeDownloadLabel)).toHaveBeenNthCalledWith(1, undefined)
      expect(vi.mocked(getSilaeDownloadLabel)).toHaveBeenNthCalledWith(2, mockedPercent)
    })

    it('should call onClickAction twice once when resolve between two clicks on action-download', async () => {
      silaeLaunchCard.vm.$emit('click-download')
      await flushPromises()
      silaeLaunchCard.vm.$emit('click-download')

      expect(vi.mocked(handleDownload)).toHaveBeenCalledTimes(2)
    })

    it('should call onClickAction only once when resolve after two clicks on action-download', () => {
      silaeLaunchCard.vm.$emit('click-download')
      silaeLaunchCard.vm.$emit('click-download')

      expect(vi.mocked(handleDownload)).toHaveBeenCalledOnce()
    })
  })
})
