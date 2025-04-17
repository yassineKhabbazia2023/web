import { nextTick } from 'vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { ExplorerDocument } from '@ged/modules/Documents/DocumentsTypes'
import { type DocumentsListProps } from './DocumentsListTypes'

import DocumentsList from './DocumentsList.vue'

const docs: Array<ExplorerDocument> = [
  {
    givenActionState: 'DONE',
    content: { name: 'test.pdf' },
    codeError: 'FileEmpty',
    isSelected: false,
  },
  {
    givenActionState: 'TO_DO',
    content: { name: 'kyaaaa.pdf' },
    codeError: '',
    isSelected: true,
  },
  {
    givenActionState: 'ERROR',
    content: { name: 'zaza.pdf' },
    codeError: 'FileEmpty',
    isSelected: true,
  }]

const defaultProps: DocumentsListProps = {
  documents: docs,
  documentsSelectorEmptyDocumentsListLabel: 'Aucun document ne peut être déposé dans votre espace documentaire.',
  isFolderLine: false,
}

const createWrapper = (
  props: DocumentsListProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentsList, {
    props,
    global: {
    },
  })
}
describe('documentsList', () => {
  describe('props', () => {
    it('should render two PFileAndFolderLineCheck properly binded', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const fflcs = wrapper.findAllComponents({ name: 'PFileAndFolderLineCheck' })
      expect(fflcs).toHaveLength(2)
      expect(fflcs[0].props('pFileName')).toBe('kyaaaa.pdf')
      expect(fflcs[1].props('pFileName')).toBe('test.pdf')
      expect(fflcs[0].props('pState')).toBe('default')
      expect(fflcs[1].props('pState')).toBe('success')
      expect(fflcs[0].props('modelValue')).toBeTruthy()
      expect(fflcs[1].props('modelValue')).toBeFalsy()

      const img = wrapper.findComponent({ name: 'PImage' })
      expect(img.exists()).toBeFalsy()

      const div = wrapper.find('.documents-list--no-valid-document')
      expect(div.exists()).toBeFalsy()
    })

    it('should not render PFileAndFolderLineCheck when only Error documents', async () => {
      const docs: Array<ExplorerDocument> = [
        {
          givenActionState: 'ERROR',
          content: { name: 'test.pdf' },
          codeError: 'FileEmpty',
          isSelected: false,
        }]
      const props: DocumentsListProps = {
        ...defaultProps,
        documents: docs,
      }
      const expectedLabel = defaultProps.documentsSelectorEmptyDocumentsListLabel
      const wrapper = createWrapper(props)
      await nextTick()

      const fflcs = wrapper.findAllComponents({ name: 'PFileAndFolderLineCheck' })
      expect(fflcs).toHaveLength(0)

      const label = wrapper.find('.no-documents-label')
      expect(label.text()).toBe(expectedLabel)

      const div = wrapper.find('.documents-list--no-valid-document')
      expect(div.exists()).toBeTruthy()
    })
  })
})
