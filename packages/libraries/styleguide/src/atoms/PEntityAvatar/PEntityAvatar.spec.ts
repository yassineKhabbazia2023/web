import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PEntityAvatar from '.'
import { AvatarRoles } from '../../utils/avatar.roles'

const createWrapper = (props: any) =>
  mount(PEntityAvatar, { props })

describe('pEntityAvatar', () => {
  describe('prospect account', () => {
    it('should forward the prospect role and clear pColor on the underlying PAvatar', () => {
      const wrapper: VueWrapper = createWrapper({ pAccountType: 'PROSPECT' })

      const avatar = wrapper.findComponent({ name: 'PAvatar' })
      expect(avatar.props('pRole')).toBe(AvatarRoles.PROSPECT)
      expect(avatar.props('pColor')).toBeUndefined()
    })

    it('should ignore pColor when the account is a prospect', () => {
      const wrapper: VueWrapper = createWrapper({
        pAccountType: 'PROSPECT',
        pColor: 'orange',
      })

      const avatar = wrapper.findComponent({ name: 'PAvatar' })
      expect(avatar.props('pRole')).toBe(AvatarRoles.PROSPECT)
      expect(avatar.props('pColor')).toBeUndefined()
    })
  })

  describe('regular account', () => {
    it('should forward pColor and render the pulse icon for regular accounts', () => {
      const wrapper: VueWrapper = createWrapper({
        pAccountType: 'REGULAR',
        pColor: 'amethyste',
      })

      const avatar = wrapper.findComponent({ name: 'PAvatar' })
      expect(avatar.props('pRole')).toBeUndefined()
      expect(avatar.props('pColor')).toBe('amethyste')

      const icon = wrapper.findComponent({ name: 'PIcon' })
      expect(icon.props('pName')).toBe('pulse')
    })

    it('should leave pColor undefined when no pColor is provided', () => {
      const wrapper: VueWrapper = createWrapper({ pAccountType: 'REGULAR' })

      const avatar = wrapper.findComponent({ name: 'PAvatar' })
      expect(avatar.props('pColor')).toBeUndefined()
    })
  })

  describe('props passthrough', () => {
    it('should propagate pType, pShape and pSelected to the underlying PAvatar', () => {
      const wrapper: VueWrapper = createWrapper({
        pAccountType: 'REGULAR',
        pType: 'small',
        pShape: 'square',
        pSelected: true,
      })

      const avatar = wrapper.findComponent({ name: 'PAvatar' })
      expect(avatar.props('pType')).toBe('small')
      expect(avatar.props('pShape')).toBe('square')
      expect(avatar.props('pSelected')).toBe(true)
    })
  })
})
