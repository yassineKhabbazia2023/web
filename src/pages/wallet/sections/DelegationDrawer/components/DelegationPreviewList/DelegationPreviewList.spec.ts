import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type {
  DelegationPreviewListProps,
  DelegationDetails,
} from './DelegationPreviewListTypes.ts'
import DelegationPreviewList from './DelegationPreviewList.vue'
import {
  PBlockHeader,
  PTable,
  PDoubleText,
} from '@kpmg/styleguide'
import { createI18n } from 'vue-i18n'
import { getInitials } from '@/helper'

const delegationList: DelegationDetails[] = [
  {
    delegate: {
      id: 1,
      firstName: 'Oussema',
      lastName: 'Ben Amor',
      email: 'obenamor@kpmg.fr',
    },
    isAutoDelegation: true,
  },
  {
    delegate: {
      id: 2,
      firstName: 'User',
      lastName: 'LastUserName',
      email: 'luser@kpmg.fr',
    },
    isAutoDelegation: false,
  },
]

const defaultProps: DelegationPreviewListProps = {
  delegationDetails: delegationList,
}

export type DelegationPreviewListWrapper = VueWrapper<
  ComponentPublicInstance<DelegationPreviewListProps>
>

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (
  props: DelegationPreviewListProps = defaultProps,
): DelegationPreviewListWrapper => {
  return mount(DelegationPreviewList, {
    props,
    global: {
      provide: {
        i18n,
      },
    },
  }) as unknown as DelegationPreviewListWrapper
}

const wrapper = createWrapper()

const findPBlockHeader = (wrapper: DelegationPreviewListWrapper) =>
  wrapper.findComponent(PBlockHeader)

const findPTable = (wrapper: DelegationPreviewListWrapper) =>
  wrapper.findComponent(PTable)

const delegate = defaultProps.delegationDetails[0].delegate

describe('delegationPreviewList', () => {
  describe('rendering', () => {
    it('should display the corect header block content', () => {
      const pBlockHeaderWraper = findPBlockHeader(wrapper)

      expect(pBlockHeaderWraper.props('pTitle')).toBe('Délégation automatique')
      expect(pBlockHeaderWraper.props('pDescription')).toBe(
        'Les nouveaux dossiers de votre portefeuille seront automatiquement synchronisés chez vos délégataires.',
      )
      expect(pBlockHeaderWraper.props('pImage')).toStrictEqual({
        pFit: 'default',
        pType: 'portrait',
        pName: 'delegation',
      })
    })

    it('should render the table formatted content correctly', () => {
      const pTableWraper = findPTable(wrapper)
      const pDoubleTextWrapper = pTableWraper.findComponent(PDoubleText)

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

