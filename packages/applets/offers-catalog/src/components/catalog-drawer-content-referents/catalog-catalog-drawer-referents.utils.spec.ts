import { ref } from 'vue'
import { loggerMock } from '@pulse/core/mocks'
import { getOfferCatalogReferentListMock } from '../../mocks/offers-catalog.service.mocks'

import { getTableReferentsColumns, getFormattedReferents, copyColumnContent } from './catalog-drawer-content-referents.utils'

const offerReferentsMock = getOfferCatalogReferentListMock()

const useClipboardMock = vi.hoisted(() => vi.fn())

vi.mock('@vueuse/core', () => ({
  useClipboard: useClipboardMock,
}))

const PNotificationMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: PNotificationMock,
}))

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

describe('catalog-drawer-content-referents.utils', () => {
  describe('getTableReferentsColumns', () => {
    it('should return tableReferentsColumns', async () => {
      const columnLabels: Record<string, string> = {
        name: 'Prénom Nom',
        hub: 'Hub',
        email: 'e-mail',
      }
      const tableReferentsColumns = getTableReferentsColumns(columnLabels)

      await expect(tableReferentsColumns).toMatchFileSnapshot('__snap__/catalog-drawer-content-referents.utils.tableReferentsColumns.snap')
    })
  })

  describe('getFormattedReferents', () => {
    it('should return formattedReferents', async () => {
      const formattedReferents = getFormattedReferents(offerReferentsMock)

      await expect(formattedReferents).toMatchFileSnapshot('__snap__/catalog-drawer-content-referents.utils.formattedReferents.snap')
    })

    it('should return empty list when referents is undefined', () => {
      const formattedReferents = getFormattedReferents()

      expect(formattedReferents).toStrictEqual([])
    })
  })

  describe('copyColumn', () => {
    const valueMock = 'copied value mock'
    const copyMock = vi.fn()
    const isSupportedMock = ref(false)
    const successMessageMock = 'email copié avec succès'
    const errorMessageMock = "échec lors de la copie de l'e-mail"

    beforeEach(() => {
      isSupportedMock.value = true
      useClipboardMock
        .mockReturnValue({
          copy: copyMock,
          isSupported: isSupportedMock,
        })
    })

    it('should copy to clipboard when isSupported is true', () => {
      isSupportedMock.value = true
      const expectedCopyParameters = [valueMock]
      const expectedNotificationParameters = {
        customClass: 'success',
        iconName: 'check',
        message: successMessageMock,
        position: 'bottom-left',
        showClose: true,
      }

      copyColumnContent(valueMock, successMessageMock, errorMessageMock)

      expect(copyMock).toHaveBeenCalledOnce()
      expect(copyMock).toHaveBeenCalledWith(...expectedCopyParameters)

      expect(PNotificationMock).toHaveBeenCalledOnce()
      expect(PNotificationMock).toHaveBeenCalledWith(expectedNotificationParameters)
    })

    it('should copy when isSupported is false', () => {
      const expectedNotificationParameters = {
        customClass: 'error',
        iconName: 'exclamationTriangle',
        message: errorMessageMock,
        position: 'bottom-left',
        showClose: true,
      }
      isSupportedMock.value = false

      copyColumnContent(valueMock, successMessageMock, errorMessageMock)

      expect(copyMock).not.toHaveBeenCalled()

      expect(PNotificationMock).toHaveBeenCalledOnce()
      expect(PNotificationMock).toHaveBeenCalledWith(expectedNotificationParameters)
    })
  })
})
