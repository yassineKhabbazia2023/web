import { describe, it, expect } from 'vitest'
import { getContentBeforeAndAfterSeparator } from './string.helper'

describe('get content before and after given separator', () => {
  it.each([
    { content: 'foo/bar', separator: '/', expected: ['foo', 'bar'] },
    { content: 'hello/world', separator: '/', expected: ['hello', 'world'] },
    { content: 'noslash', separator: '/', expected: ['noslash', ''] },
    { content: 'first-second', separator: '-', expected: ['first', 'second'] },
    { content: 'a|b|c', separator: '|', expected: ['a', 'b|c'] },
  ])(
    'should return $expected for content="$content" with separator="$separator"',
    ({ content, separator, expected }) => {
      const result = getContentBeforeAndAfterSeparator(content, separator)
      expect(result).toEqual(expected)
    },
  )
})
