import { describe, it, expect } from 'vitest'
import { getMockedOccurrence } from './Occurrence'

describe('test Occurrence', () => {
  it('should return mocked occurrence', () => {
    const occurrence = getMockedOccurrence({ id: 5 })

    expect(occurrence).toMatchFileSnapshot('snap/occurrence.snap')
  })

  it('should return mocked occurrence when no params', () => {
    const occurrence = getMockedOccurrence()

    expect(occurrence).toMatchFileSnapshot('snap/occurrence.noParams.snap')
  })
})
