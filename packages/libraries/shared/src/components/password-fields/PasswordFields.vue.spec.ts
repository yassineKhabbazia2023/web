import { mount } from '@vue/test-utils'
import { PStrengthLevel } from '@pulse/styleguide/types'
import type { PasswordFieldsProps } from './password-fields.types'
import PasswordFields from './PasswordFields.vue'

// The styleguide stays real in the shared project (see vitest.setup.ts): the
// element-plus wrappers are replaced with lightweight per-mount stubs instead
// of a spec-level vi.mock (doctrine: shared-hubs).
const styleguideStubs = {
  PFormItem: {
    name: 'PFormItem',
    template: '<div class="p-form-item"><slot /></div>',
    props: ['pLabel', 'prop', 'pRequired'],
  },
  PInput: {
    name: 'PInput',
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="pDisabled" />',
    props: ['modelValue', 'pType', 'pShowPassword', 'pPlaceholder', 'pDisabled', 'pAutocomplete'],
    emits: ['update:modelValue'],
  },
  PStrength: {
    name: 'PStrength',
    template: '<div class="p-strength">Strength: {{ modelValue }}</div>',
    props: ['modelValue', 'labels'],
  },
}

function createWrapper(props: PasswordFieldsProps = {}) {
  return mount(PasswordFields, {
    props,
    global: {
      stubs: styleguideStubs,
    },
  })
}

describe('PasswordFields.vue', () => {
  it('should render without current password field by default', () => {
    const wrapper = createWrapper()

    const formItems = wrapper.findAll('.p-form-item')
    expect(formItems).toHaveLength(2)
  })

  it('should render with current password field when requireCurrentPassword is true', () => {
    const wrapper = createWrapper({
      requireCurrentPassword: true,
    })

    const formItems = wrapper.findAll('.p-form-item')
    expect(formItems).toHaveLength(3)
  })

  it('should update newPassword model value', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Test123!')
    expect(wrapper.vm.newPassword).toBe('Test123!')
  })

  it('should update confirmPassword model value', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')

    await inputs[1].setValue('Test123!')
    expect(wrapper.vm.confirmPassword).toBe('Test123!')
  })

  it('should compute password strength correctly', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Test123!')
    expect(wrapper.vm.getPasswordStrength()).toBe(PStrengthLevel.STRONG)
  })

  it('should show password strength gauge when isPasswordStrengthGaugeVisible is true and password is entered', async () => {
    const wrapper = createWrapper({
      isPasswordStrengthGaugeVisible: true,
    })

    expect(wrapper.find('.p-strength').exists()).toBe(false)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Test123!')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.p-strength').exists()).toBe(true)
  })

  it('should not show password strength gauge when isPasswordStrengthGaugeVisible is false', async () => {
    const wrapper = createWrapper({
      isPasswordStrengthGaugeVisible: false,
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Test123!')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.p-strength').exists()).toBe(false)
  })

  it('should expose reset method that clears all fields', async () => {
    const wrapper = createWrapper({
      requireCurrentPassword: true,
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('current')
    await inputs[1].setValue('new')
    await inputs[2].setValue('confirm')

    wrapper.vm.reset()

    expect(wrapper.vm.currentPassword).toBe('')
    expect(wrapper.vm.newPassword).toBe('')
    expect(wrapper.vm.confirmPassword).toBe('')
  })

  it('should expose getPasswordStrength method', () => {
    const wrapper = createWrapper()

    expect(typeof wrapper.vm.getPasswordStrength).toBe('function')
    expect(wrapper.vm.getPasswordStrength()).toBe(PStrengthLevel.EMPTY)
  })

  it('should disable inputs when disabled prop is true', () => {
    const wrapper = createWrapper({
      disabled: true,
      requireCurrentPassword: true,
    })

    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined()
    })
  })
})
