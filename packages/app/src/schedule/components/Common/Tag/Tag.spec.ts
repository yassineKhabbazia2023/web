import wrapperFactory from '@app/__mocks__/wrapper.factory'
import { expect, describe, it } from 'vitest'

import Tag from '.'

const createWrapper = (statusCode: string) =>
  wrapperFactory(Tag, { props: { status: statusCode } })

describe('tag status management', () => {
  it.each([
    { statusCode: 'Done', expected: 'Done' },
    { statusCode: 'Todo', expected: 'To do' },
    { statusCode: 'Draft', expected: 'Draft' },
  ])('tag($statusCode) -> $expected', ({ statusCode, expected }:any) => {
    const wrapper = createWrapper(statusCode)
    expect(wrapper
      .find(`[content="${expected}"]`)).toBeTruthy()
    wrapper.unmount()
  })
})
