import { nextTick } from 'vue'
import { PDrawer } from '@kpmg/styleguide'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { AddCollaboratorsDrawerProps } from './AddCollaboratorsDrawerTypes'
import { entityMock } from '@/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import AddCollaboratorsDrawer from '.'
import AddCollaboratorsCard from './components/AddCollaboratorsCard'
import { API_PREFIXES } from '@/common/config/services'

const SELECTED_CONTACTS = [{ id: 1 }, { id: 2 }]

const getNotificationSuccess = () =>
  document.body.getElementsByClassName('el-notification success')

const gatewayPostMock = vi.fn().mockResolvedValue({})
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: gatewayPostMock,
    },
  }),
}))

const defaultProps: AddCollaboratorsDrawerProps = {
  modelValue: true,
  entityId: entityMock.accountId,
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: AddCollaboratorsDrawerProps = defaultProps,
): VueWrapper => {
  return mount(AddCollaboratorsDrawer, {
    props,
    global: {
      provide: {
        i18n,
        toast: mockToastPlugin,
      },
      stubs: ['AddCollaboratorsCard', 'AddCollaboratorsAutocomplete'],
    },
  })
}

let wrapper = createWrapper()

const findNextPreviousButton = (wrapper: VueWrapper) =>
  wrapper.findComponent(NextPreviousButtons)

const findAddCollaboratorsCardWrapper = (wrapper: VueWrapper) =>
  wrapper.findComponent(AddCollaboratorsCard)

describe('add collaborators drawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })

  describe('props', () => {
    it.each([
      {
        isAddCollaboratorsDrawerVisible: true,
      },
      {
        isAddCollaboratorsDrawerVisible: false,
      },
    ])(
      'should display drawer based on received prop',
      async ({ isAddCollaboratorsDrawerVisible }) => {
        const drawerWrapper = wrapper.findComponent(PDrawer)
        wrapper.setProps({ modelValue: isAddCollaboratorsDrawerVisible })

        await nextTick()
        expect(drawerWrapper.props('modelValue')).toBe(
          isAddCollaboratorsDrawerVisible,
        )
      },
    )
  })

  describe('interactions', () => {
    it('should set selectedCollaborators on collaborator-selection', async () => {
      const addCollaboratorsCard = findAddCollaboratorsCardWrapper(wrapper)
      const nextPreviousButtonWrapper = findNextPreviousButton(wrapper)
      expect(
        nextPreviousButtonWrapper.props('isNextButtonDisabled'),
      ).toBeTruthy()

      await addCollaboratorsCard.vm.$emit('collaborator-selection', [1, 2, 3])

      expect(
        nextPreviousButtonWrapper.props('isNextButtonDisabled'),
      ).toBeFalsy()
    })

    describe('nextPreviousButtons', () => {
      it('should call api to add collaborators to entity', async () => {
        const addCollaboratorsCard = findAddCollaboratorsCardWrapper(wrapper)
        expect(getNotificationSuccess()).toHaveLength(0)

        await addCollaboratorsCard.vm.$emit(
          'collaboratorSelection',
          SELECTED_CONTACTS,
        )

        const nextPreviousButtonWrapper = findNextPreviousButton(wrapper)
        await nextPreviousButtonWrapper.vm.$emit('click-next')

        expect(gatewayPostMock).toHaveBeenCalledTimes(2)
        expect(gatewayPostMock).toHaveBeenNthCalledWith(
          1,
          `${API_PREFIXES.ACCOUNT}/roles`,
          {
            accountId: defaultProps.entityId,
            contactId: 1,
            isSignatory: false,
            isFavorite: false,
            isDelegation: false,
          },
        )
        expect(gatewayPostMock).toHaveBeenNthCalledWith(
          2,
          `${API_PREFIXES.ACCOUNT}/roles`,
          {
            accountId: defaultProps.entityId,
            contactId: 2,
            isSignatory: false,
            isFavorite: false,
            isDelegation: false,
          },
        )

        expect(nextPreviousButtonWrapper.props('isNextButtonLoading')).toBeTruthy()
        await flushPromises()
        expect(getNotificationSuccess()).toHaveLength(1)
      })
    })
  })
})
