import { mount, type VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { DelegationPreviewListProps } from './DelegationPreviewListTypes'
import DelegationPreviewList from './DelegationPreviewList.vue'
import { PBlockHeader, PTable, PDoubleText } from '@pulse/styleguide/components'
import { getInitials } from '@entities/helpers'

const delegationList: DelegationPreviewListProps['modelValue'] = [
  {
    delegate: {
      id: 1,
      firstName: 'Oussema',
      lastName: 'Ben Amor',
      email: 'obenamor@test.fr',
    },
    isAutomaticDelegation: true,
  },
  {
    delegate: {
      id: 2,
      firstName: 'User',
      lastName: 'LastUserName',
      email: 'luser@test.fr',
    },
    isAutomaticDelegation: false,
  },
]

const defaultProps: DelegationPreviewListProps = {
  modelValue: delegationList,
}

export type DelegationPreviewListWrapper = VueWrapper<
  ComponentPublicInstance<DelegationPreviewListProps>
>

const createWrapper = (
  props: DelegationPreviewListProps = defaultProps,
): DelegationPreviewListWrapper => {
  return mount(DelegationPreviewList, {
    props,
  }) as unknown as DelegationPreviewListWrapper
}

// Mounting at import time would run before the per-test guards re-arm the
// spy-wrapped modules (e.g. the vue-i18n hub): mount before each test instead.
let wrapper: DelegationPreviewListWrapper

beforeEach(() => {
  wrapper = createWrapper()
})

const findPBlockHeader = (wrapper: DelegationPreviewListWrapper) =>
  wrapper.findComponent(PBlockHeader)

const findPTable = (wrapper: DelegationPreviewListWrapper) =>
  wrapper.findComponent(PTable)

const delegate = defaultProps.modelValue[0].delegate

describe('delegationPreviewList', () => {
  describe('rendering', () => {
    it('should display the correct header block content', () => {
      const pBlockHeaderWrapper = findPBlockHeader(wrapper)

      expect(pBlockHeaderWrapper.props('pTitle')).toBe('headerBlock.title')
      expect(pBlockHeaderWrapper.props('pDescription')).toBe('headerBlock.description')
      expect(pBlockHeaderWrapper.props('pImage')).toStrictEqual({
        pFit: 'fill',
        pName: 'person-delegation-duotone',
      })
    })

    it('should render the table formatted content correctly', () => {
      const pTableWrapper = findPTable(wrapper)
      const pDoubleTextWrapper = pTableWrapper.findComponent(PDoubleText)

      const expectedPprofile = getInitials(
        delegate.firstName,
        delegate.lastName,
      )

      const expectedPtitle = `${delegate.firstName} ${delegate.lastName}`
      const expectedPcontent = delegate.email

      expect(pDoubleTextWrapper.props('pProfile')).toBe(expectedPprofile)
      expect(pDoubleTextWrapper.props('pTitle')).toBe(expectedPtitle)
      expect(pDoubleTextWrapper.props('pContent')).toBe(expectedPcontent)
    })
  })
})
