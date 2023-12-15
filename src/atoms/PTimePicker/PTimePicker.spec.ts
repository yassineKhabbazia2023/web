import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElTimePicker } from 'element-plus'
import PTimePicker from '.'
import type { PTimePickerProps } from './PTimePickerTypes'

const propsValue: PTimePickerProps = {
  pReadonly: false,
  pDisabled: false,
  pEditable: true,
  pClearable: true,
  pSize: 'small',
  pPlaceholder: 'placeholder',
  pStartPlaceholder: 'startPlaceholder',
  pEndPlaceholder: 'endPlaceholder',
  pIsRange: false,
  pArrowControl: false,
  pPopperClass: 'popperClass',
  pRangeSeparator: '-',
  pFormat: 'format',
  pDefaultValue: new Date(),
  pId: 'id',
  pName: 'name',
  pLabel: 'label',
  pPrefixIcon: 'prefixIcon',
  pClearIcon: 'clearIcon',
  pDisabledHours: vi.fn(),
  pDisabledMinutes: vi.fn(),
  pDisabledSeconds: vi.fn(),
  pTeleported: true,
  pTabindex: 0
}
const createWrapper = () => mount(PTimePicker, {
  props: propsValue
})

describe('pTimePicker', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElTimePicker).vm
    expect(componentVM.readonly).toBe(propsValue.pReadonly)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.editable).toBe(propsValue.pEditable)
    expect(componentVM.clearable).toBe(propsValue.pClearable)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.placeholder).toBe(propsValue.pPlaceholder)
    expect(componentVM.startPlaceholder).toBe(propsValue.pStartPlaceholder)
    expect(componentVM.endPlaceholder).toBe(propsValue.pEndPlaceholder)
    expect(componentVM.isRange).toBe(propsValue.pIsRange)
    expect(componentVM.arrowControl).toBe(propsValue.pArrowControl)
    expect(componentVM.popperClass).toBe(propsValue.pPopperClass)
    expect(componentVM.rangeSeparator).toBe(propsValue.pRangeSeparator)
    expect(componentVM.format).toBe(propsValue.pFormat)
    expect(componentVM.defaultValue).toBe(propsValue.pDefaultValue)
    expect(componentVM.id).toBe(propsValue.pId)
    expect(componentVM.name).toBe(propsValue.pName)
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.prefixIcon).toBe(propsValue.pPrefixIcon)
    expect(componentVM.clearIcon).toBe(propsValue.pClearIcon)
    expect(componentVM.disabledHours).toBe(propsValue.pDisabledHours)
    expect(componentVM.disabledMinutes).toBe(propsValue.pDisabledMinutes)
    expect(componentVM.disabledSeconds).toBe(propsValue.pDisabledSeconds)
    expect(componentVM.tabindex).toBe(propsValue.pTabindex)
  })
})
