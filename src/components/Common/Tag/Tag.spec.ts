import Tag from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it } from 'vitest'
import {
  waitForAsyncImports
} from '@kpmg/common/src/testing-helpers'

const createWrapper = (statusCode: string) =>
  wrapperFactory(Tag, { props: { status: statusCode } })

describe('tag status management', () => {
  it.each([
    { statusCode: '10', expected: 'Incident' },
    { statusCode: '20', expected: 'To do' },
    { statusCode: '30', expected: 'In progress' },
    { statusCode: '40', expected: 'Active' },
    { statusCode: '50', expected: 'Inactive' }
  ])('tag($statusCode) -> $expected', async ({ statusCode, expected }:any) => {
    const wrapper = createWrapper(statusCode)
    await waitForAsyncImports(3)
    expect(wrapper
      .find(`[content="${expected}"]`)).toBeTruthy()
    wrapper.unmount()
  })
})
