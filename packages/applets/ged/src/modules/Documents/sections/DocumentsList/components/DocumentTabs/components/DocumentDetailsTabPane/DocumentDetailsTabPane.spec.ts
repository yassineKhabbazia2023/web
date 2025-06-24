import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { documentMock } from '@ged/__mocks__/documents.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import type { DocumentDetailsTabPaneProps } from './DocumentDetailsTabPaneTypes'
import { downloadDocument } from '@ged/services/Documents'

import DocumentDetailsTabPane from '.'

const defaultProps: DocumentDetailsTabPaneProps = {
  document: documentMock,
  selectedEntity: '',
  currentService: '',
  accountId: 1234,
}

function getMockedUpdatedDocument(status: string, labelFr: string | null, path: string[]) {
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

vi.mock('@pulse/styleguide')

vi.mock('@ged/services/Documents', () => documentsServiceMock)

const createWrapper = (
  props: DocumentDetailsTabPaneProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentDetailsTabPane, {
    props,
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
    const buttonUpload = documentDetailsTabPane.findComponent({ name: 'PButton' })
    expect(buttonUpload.exists()).toBeTruthy()

    buttonUpload.trigger('click')
    expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
      defaultProps.currentService,
      defaultProps.selectedEntity,
      documentMock.id,
      defaultProps.accountId,
    )
  })

  describe('should rebder icon correctly based on pia status', () => {
    const cases = [
      {
        status: 'Collected',
        expectedIcon: 'checkCircle',
      },
      {
        status: 'Duplicate',
        expectedIcon: 'checkCircle',
      },
      {
        status: 'Archived',
        expectedIcon: 'checkCircle',
      },
    ]

    it.each(cases)(
      'pText mapping validation',
      async ({ status, expectedIcon }) => {
        const updatedDocument = getMockedUpdatedDocument(status, 'Actif', ['Comptabilité', 'Dépôt'])
        const updatedProps = { ...defaultProps, document: updatedDocument }
        await nextTick()
        const documentDetailsTabPane = createWrapper(updatedProps)
        const pTagWrapper = documentDetailsTabPane.findAllComponents({ name: 'PTag' })[1]
        await nextTick()

        expect(
          pTagWrapper.props('pIconLeftName'),
        ).toBe(expectedIcon)
      },
    )
  })

  it('should hide tag if label is null', async () => {
    const updatedDocument = getMockedUpdatedDocument('', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents({ name: 'PTag' })
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })

  it('should hide tag if technical name is not a transmitted document technical name', async () => {
    const updatedDocument = getMockedUpdatedDocument('Collectable', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents({ name: 'PTag' })
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
    const pTagWrapper = documentDetailsTabPane.findAllComponents({ name: 'PTag' })
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })

  it('should hide tag if label is null (2)', async () => {
    const updatedDocument = getMockedUpdatedDocument('', null, ['My Documents', 'Dir'])

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents({ name: 'PTag' })
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })
})
