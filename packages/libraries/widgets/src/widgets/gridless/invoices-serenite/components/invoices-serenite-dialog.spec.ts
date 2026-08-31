import { mount } from '@vue/test-utils'

import InvoicesSereniteDialog from './invoices-serenite-dialog.vue'

describe('InvoicesSereniteDialog', () => {
  // PDialog declares a 'close' emit but never emits it: closing only surfaces through the model update
  it('should emit close when the dialog is dismissed', async () => {
    const wrapper = mount(InvoicesSereniteDialog, { props: { modelValue: true } })

    await wrapper.findComponent({ name: 'PDialog' }).vm.$emit('update:modelValue', false)

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
