import { getAvatarColorFromKey } from './avatar-colors.helper'

describe('getAvatarColor', () => {
  it('should return a color for a given name', () => {
    const color = getAvatarColorFromKey('John Doe')
    expect(color).toBeDefined()
  })

  it('should return the same color for the same name', () => {
    const color1 = getAvatarColorFromKey('Jane Doe')
    const color2 = getAvatarColorFromKey('Jane Doe')
    expect(color1).toBe(color2)
  })
})
