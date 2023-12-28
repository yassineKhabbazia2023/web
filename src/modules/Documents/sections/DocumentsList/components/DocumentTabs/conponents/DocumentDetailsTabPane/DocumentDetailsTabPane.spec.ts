/* eslint-disable vitest/max-expects */
import { VueWrapper, mount } from '@vue/test-utils'
import DocumentDetailsTabPane from '.'
import { DocumentDetailsTabPaneProps } from './DocumentDetailsTabPaneTypes'
import { vi, describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import {
  PButton, PIArrowRepeat,
  PICheckCircle, PIExclamationTriangle, PIStars, PTag
} from '@kpmg/styleguide'
import { downloadDocument } from '@/services/Documents'
import { documentMock } from '@/modules/Documents/mocks/documentMock'
import { nextTick } from 'vue'

const defaultProps: DocumentDetailsTabPaneProps = {
  document: documentMock,
  selectedEntity: '',
  currentService: ''
}

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))
vi.mock('@/services/Documents', () => ({
  downloadDocument: vi.fn()
}))
const pinia = createPinia()
const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DocumentDetailsTabPaneProps = defaultProps
): VueWrapper<any> => {
  return mount(DocumentDetailsTabPane, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
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
    expect(documentDetailsTabPane.findAll('.label')[7].text()).toBe('Actif')
    const buttonUpload = documentDetailsTabPane.findComponent(PButton)
    expect(buttonUpload.exists()).toBeTruthy()

    buttonUpload.trigger('click')
    expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
      defaultProps.currentService,
      defaultProps.selectedEntity,
      documentMock.id
    )
  })

  describe('should rebder icon correctly based on pia status', async () => {
    const cases = [
      {
        status: 'New',
        expectedIcon: PIStars
      },
      {
        status: 'Collectable',
        expectedIcon: PIArrowRepeat
      },
      {
        status: 'Collected',
        expectedIcon: PICheckCircle
      },
      {
        status: 'Duplicate',
        expectedIcon: PICheckCircle
      },
      {
        status: 'Error',
        expectedIcon: PIExclamationTriangle
      },
      {
        status: 'Archived',
        expectedIcon: PICheckCircle
      },
      {
        status: 'NotTransmitted',
        expectedIcon: PIExclamationTriangle
      }
    ]

    it.each(cases)(
      'pText mapping validation',
      async ({ status, expectedIcon }) => {
        const updatedDocument = {
          ...documentMock,
          piaStatus: {
            technicalName: status,
            labelFr: 'Actif',
            labelEn: 'Active',
            date: '2023-10-11T08:09:26Z'
          },
          type: '.pdf',
          folder: {
            id: 1,
            path: ['My Documents', 'Dir']
          }

        }

        const updatedProps = { ...defaultProps, document: updatedDocument }
        await nextTick()
        const documentDetailsTabPane = createWrapper(updatedProps)
        const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)[1]
        await nextTick()

        expect(
          pTagWrapper.props('pIconLeft')
        ).toBe(expectedIcon)
      }
    )

  })

  it('should hide tag if label is null', async () => {
    const updatedDocument = {
      ...documentMock,
      piaStatus: {
        technicalName: '',
        labelFr: null,
        labelEn: 'Active',
        date: '2023-10-11T08:09:26Z'
      },
      type: '.pdf',
      folder: {
        id: 1,
        path: ['My Documents', 'Dir']
      }
    }

    const updatedProps = { ...defaultProps, document: updatedDocument }
    await nextTick()
    const documentDetailsTabPane = createWrapper(updatedProps)
    const pTagWrapper = documentDetailsTabPane.findAllComponents(PTag)
    await nextTick()

    expect(pTagWrapper).toHaveLength(1)
  })
})
