 
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import DocumentDetailsTabPane from '.'
import type { DocumentDetailsTabPaneProps } from './DocumentDetailsTabPaneTypes'
import { vi, describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import {
  PButton,
  PICheckCircle, PTag,
} from '@pulse/styleguide/components'
import { downloadDocument } from '@ged/services/Documents'
import { documentMock } from '@ged/modules/Documents/mocks/documentMock'
import { nextTick } from 'vue'

const defaultProps: DocumentDetailsTabPaneProps = {
  document: documentMock,
  selectedEntity: '',
  currentService: '',
}

function getMockedUpdatedDocument(status: string, labelFr: string|null, path: string[]) {
  const updatedDocument = {
    ...documentMock,
    piaStatus: {
      technicalName: status,
      labelFr,
      labelEn: 'Active',
      date: '2023-10-11T08:09:26Z',
    },
    type: '.pdf',
    folder: {
      id: 1,
      path,
    },
  }

  return updatedDocument
}

vi.mock('@ged/services/Documents', () => ({
  downloadDocument: vi.fn(),
}))
const pinia = createPinia()
const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DocumentDetailsTabPaneProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentDetailsTabPane, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  })
}

describe('documentDetailsTabPane', () => {
  it('should render the component with the correct properties', () => {
    const documentDetailsTabPane = createWrapper()

    expect(documentDetailsTabPane.findAll('.label')[0].text()).toBe('Certifié')
    expect(documentDetailsTabPane.find('.size').text()).toBe('1 Ko')
    expect(documentDetailsTabPane.findAll('.label')[1].text()).toBe('PDF')
    expect(documentDetailsTabPane.findAll('.label')[3].text()).toBe('My Documents')
    expect(documentDetailsTabPane.findAll('.label')[4].text()).toBe('Jane Doe')
    expect(documentDetailsTabPane.findAll('.label')[5].text()).toBe('10/10/2023')
    expect(documentDetailsTabPane.findAll('.label')[6].text()).toBe('11/10/2023')
    const buttonUpload = documentDetailsTabPane.findComponent(PButton)
    expect(buttonUpload.exists()).toBeTruthy()

    buttonUpload.trigger('click')
    expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
      defaultProps.currentService,
      defaultProps.selectedEntity,
      documentMock.id,
    )
  })

  describe('should rebder icon correctly based on pia status', () => {
    const cases = [
      {
        status: 'Collected',
        expectedIcon: PICheckCircle,
      },
      {
        status: 'Duplicate',
        expectedIcon: PICheckCircle,
      },
      {
        status: 'Archived',
        expectedIcon: PICheckCircle,
      },
    ]

    it.each(cases)(
      'pText mapping validation',
      async ({ status, expectedIcon }) => {
        const updatedDocument = getMockedUpdatedDocument(status, 'Actif', ['Comptabilité', 'Dépôt'])
        const updatedProps = { ...defaultProps, document: updatedDocument }
        await nextTick()
        const documentDetailsTabPane = createWrapper(updatedProps)
        const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)[1]
        await nextTick()

        expect(
          pTagWrapper.props('pIconLeft'),
        ).toBe(expectedIcon)
      },
    )
  })

  it('should hide tag if label is null', async () => {
    const updatedDocument = getMockedUpdatedDocument('', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })

  it('should hide tag if technical name is not a transmitted document technical name', async () => {
    const updatedDocument = getMockedUpdatedDocument('Collectable', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })

  it.each([
    {
      path: ['Comptabilité', 'Dépôt'],
    },
    {
      path: ['Comptabilité', 'Dépôt', 'Achats'],
    },
    {
      path: ['Comptabilité', 'Dépôt', 'Ventes'],
    },
  ])('should hide tag if document is not inside a PIA synced folder', async ({ path }) => {
    const updatedDocument = getMockedUpdatedDocument('Collectable', null, path)

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })

  it('should hide tag if label is null (2)', async () => {
    const updatedDocument = getMockedUpdatedDocument('', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })
})
