import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCol from '.'

const propsValue = {
  pSpan: 1,
  pOffset: 2,
  pPush: 3,
  pPull: 4,
  pXs: 5,
  pSm: 6,
  pMd: 7,
  pLg: 8,
  pXl: 9,
  pTag: 'testTag'
}
const createWrapper = () => mount(PCol, {
  props: propsValue,
  slots: {
    default: 'col text'
  }
})

describe('pCol', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElCol' })

    const expectedProps = {
      span: propsValue.pSpan,
      offset: propsValue.pOffset,
      push: propsValue.pPush,
      pull: propsValue.pPull,
      xs: propsValue.pXs,
      sm: propsValue.pSm,
      md: propsValue.pMd,
      lg: propsValue.pLg,
      xl: propsValue.pXl,
      tag: propsValue.pTag
    }
    expect(component.props()).toMatchObject(expectedProps)
    expect(wrapper.findComponent({ name: 'ElCol' }).text()).toBe('col text')
  })
})
