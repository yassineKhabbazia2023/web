import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCol from '.'
import { ElCol } from 'element-plus'

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
    const componentEP = wrapper.findComponent(ElCol).vm

    expect(componentEP.span).toBe(propsValue.pSpan)
    expect(componentEP.offset).toBe(propsValue.pOffset)
    expect(componentEP.push).toBe(propsValue.pPush)
    expect(componentEP.pull).toBe(propsValue.pPull)
    expect(componentEP.xs).toBe(propsValue.pXs)
    expect(componentEP.sm).toBe(propsValue.pSm)
    expect(componentEP.md).toBe(propsValue.pMd)
    expect(componentEP.lg).toBe(propsValue.pLg)
    expect(componentEP.xl).toBe(propsValue.pXl)
    expect(componentEP.tag).toBe(propsValue.pTag)
    expect(wrapper.findComponent(ElCol).text()).toBe('col text')
  })
})
