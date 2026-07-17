import { shallowMount } from '@vue/test-utils'
import PButtonGroup from './'


describe('test for PButtonGroup', () => {
  it('render correctly', () => {
    const wrapper = shallowMount(PButtonGroup, {
      props: {
        pType: 'default',
        pSize: 'default',
      },
      slots: {
        default: '<div data-testid="slot-content" />',
      },
      global: {
        stubs: {
          ElButtonGroup: {
            name: 'PButtonGroup',
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const PButtonElement = wrapper.findComponent({ name: 'PButtonGroup' })
    expect(PButtonElement.exists()).toBeTruthy()
    expect(wrapper.find('[data-testid="slot-content"]').exists()).toBeTruthy()
  })
})
