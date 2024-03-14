import { expect, describe, it, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getMockedStepNotes } from './StepNotesMock'
import StepNote from '.'

const notes = getMockedStepNotes()
const expectedTextareaLabel = 'Note for the Middle Office (MOD)'
const expectedTextareaPlaceholder = 'Write your comment'

const createWrapper = () =>
  mount(StepNote, {
    props: { modelValue: notes[0] }
  })

describe('stepNote', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display correctly the stepNote', () => {
      const textareaLabel = wrapper.find('.el-form-item__label')
      const input = wrapper.findComponent({ name: 'PInput' })

      expect(input.props('pType')).toBe('textarea')
      expect(input.props('pPlaceholder')).toBe(expectedTextareaPlaceholder)
      expect(textareaLabel.text()).toStrictEqual(expectedTextareaLabel)
    })
  })
  describe('props', () => {
    it("should ensure that the 'modelValue' prop is passed", () => {
      expect(wrapper.props('modelValue')).toStrictEqual(notes[0])
    })
  })
  describe('events', () => {
    const newNote = 'New note'
    it("should emit 'update:modelValue' when the textarea note value changes", () => {
      const input = wrapper.findComponent({ name: 'PInput' })
      input.setValue(newNote)

      expect(input.emitted('update:modelValue')).toStrictEqual([[newNote]])
    })
    it("should emit 'update:modelValue' when the internalModel value changes", () => {
      wrapper.vm.internalModel = newNote

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[newNote]])
    })
  })
})
