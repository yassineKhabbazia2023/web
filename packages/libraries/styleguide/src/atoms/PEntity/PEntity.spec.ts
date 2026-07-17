import { shallowMount } from '@vue/test-utils'
import PEntity from './'

import type { PEntityProps } from './PEntityTypes'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

const defaultProps: PEntityProps = {
  pContent: content,
  pType: 'primary',
}

function createWrapper(overridenProps: Partial<PEntityProps> = {}) {
  const props = {
    ...defaultProps,
    ...overridenProps,
  }
  return shallowMount(PEntity, {
    props,
    global: {
      stubs: {
        PAvatar: {
          name: 'PAvatar',
          template: '<div><slot /></div>',
        },
        PIcon: true,
      },
    },
  })
}

describe('tests for p-entity', () => {
  it('renders with content', () => {
    const props: PEntityProps = {
      pContent: content,
      pType: 'primary',
      pSelected: false,
    }
    const wrapper = createWrapper(props)

    const pEntity = wrapper.findComponent({ name: 'PEntity' })

    expect(pEntity.exists()).toBeTruthy()

    const text = wrapper.text()
    expect(text).toBe(content)
  })

  it('renders with an avatar', () => {
    const props: PEntityProps = {
      pContent: content,
      pType: 'primary',
      pIconName: 'pulse',
      pIconShape: 'circle',
      pIconColor: 'persian-gradient',
      pSelected: false,
    }
    const wrapper = createWrapper(props)

    const pAvatar = wrapper.findComponent({ name: 'PAvatar' })
    const pIcon = pAvatar.findComponent({ name: 'PIcon' })

    expect(pAvatar.exists()).toBeTruthy()
    expect(pIcon.exists()).toBeTruthy()
    expect(pIcon.props('pName')).toBe(props.pIconName)
  })
})
