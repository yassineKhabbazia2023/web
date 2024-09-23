import BinTableElement from '@ged/modules/Bin/sections/BinDocumentsList/components/BinTableElement'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { type BinTableElementProps } from './BinTableElementTypes'
import { PText, PDoubleText, PIcon, PIArrowCounterclockwise, PIFiletypeJpg } from '@kpmg/styleguide'

const defaultProps: BinTableElementProps = {
  fieldType: '',
  data: {
    id: '200fbe69-9dbd-47e3-b9a3-0d58cc46b1b2',
    name: 'Final (22) (7).jpg',
    deleted: '2023-12-14T11:41:41.650',
    path: ['Comptabilité', 'Dépôt', 'aui classer'],
  },
}

const pinia = createPinia()

const createWrapper = (
  props: BinTableElementProps = defaultProps,
) => {
  return mount(BinTableElement, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

describe('binTableElement', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should map PDoubleText component correctly based on fieldType', async () => {
      expect.hasAssertions()
      const updatedProps: BinTableElementProps = {
        ...defaultProps,
        fieldType: 'DoubleText',
      }

      const wrapper = createWrapper(updatedProps)

      const field = await wrapper.findComponent(PDoubleText)
      await nextTick()
      expect(field.exists()).toBeTruthy()
      expect(field.props('pTitle')).toBe(updatedProps.data.name)
      expect(field.props('pContent')).toBe('Comptabilité > Dépôt > aui classer')
      expect(field.props('pIcon')).toBe(PIFiletypeJpg)
    })

    it('should map PText component correctly based on fieldType', async () => {
      expect.hasAssertions()
      const updatedProps: BinTableElementProps = {
        ...defaultProps,
        fieldType: 'Text',
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const field = await wrapper.findComponent(PText)
      expect(field.exists()).toBeTruthy()
      expect(field.props('pContent')).toBe('14/12/2023')
    })

    it('should map PIcon component correctly based on fieldType', async () => {
      expect.hasAssertions()
      const updatedProps: BinTableElementProps = {
        ...defaultProps,
        fieldType: 'ActionGroup',
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const field = await wrapper.findComponent(PIcon)
      expect(field.exists()).toBeTruthy()
      const icon = await wrapper.findComponent(PIArrowCounterclockwise)
      expect(icon.exists()).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('should emit restore-document-action when icon is clicked', async () => {
      expect.hasAssertions()
      const updatedProps: BinTableElementProps = {
        ...defaultProps,
        fieldType: 'ActionGroup',
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const field = await wrapper.findComponent(PIcon)
      field.trigger('click')
      await nextTick()
      expect(wrapper.emitted('restore-document-action')).toHaveLength(1)
      expect(wrapper.emitted('restore-document-action')).toStrictEqual([[updatedProps.data]])
    })
  })
})
