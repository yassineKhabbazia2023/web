import Tag from '.'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { expect, describe, it } from 'vitest'

const createWrapper = (statusCode: string) =>
  wrapperFactory(Tag, { props: { status: statusCode } })

describe('tag status management', () => {
  it.each([
    { statusCode: '99', expected: 'Creating' },
    { statusCode: '10', expected: 'Incident' },
    { statusCode: '20', expected: 'To do' },
    { statusCode: '30', expected: 'In progress' },
    { statusCode: '40', expected: 'Active' },
    { statusCode: '50', expected: 'Inactive' },
  ])('tag($statusCode) -> $expected', ({ statusCode, expected }:any) => {
    const wrapper = createWrapper(statusCode)
    expect(wrapper
      .find(`[content="${expected}"]`)).toBeTruthy()
    wrapper.unmount()
  })
})
