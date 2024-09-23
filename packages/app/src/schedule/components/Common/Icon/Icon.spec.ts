import Icon from '.'
import wrapperFactory from '@app/schedule/tests/utils/wrapperFactory'
import { expect, describe, it } from 'vitest'

const createWrapper = (statusCode: string) =>
  wrapperFactory(Icon, { props: { status: statusCode } })

describe('tag status management', () => {
  it.each([
    { statusCode: 'Done', expected: 'PICheckCircle' },
    { statusCode: 'Todo', expected: 'PILoader' },
    { statusCode: 'Draft', expected: 'PISticky' },
  ])('icon($statusCode)', ({ statusCode, expected }:any) => {
    const wrapper = createWrapper(statusCode)
    const icon = wrapper
      .findComponent({ name: expected })
      .exists()

    expect(icon).toBeTruthy()
    wrapper.unmount()
  })
})
