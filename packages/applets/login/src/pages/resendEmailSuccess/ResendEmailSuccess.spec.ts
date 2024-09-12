import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ResendEmailSuccess from '.'

const createWrapper = () => mount(ResendEmailSuccess)

describe('test ResendEmailSuccess', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('display', () => {
    it('should display component properly', () => {
      const a = wrapper.find('a')
      const expectedLink = '/login'

      expect(a.attributes('href')).toBe(expectedLink)
    })
  })
})
