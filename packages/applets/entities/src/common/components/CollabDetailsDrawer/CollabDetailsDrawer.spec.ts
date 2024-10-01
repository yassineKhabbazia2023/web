import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import {
  getMockedCollaborators,
  getFormattedMockedCollaborators,
} from '@entities/common/mocks/mockedCollaborators'
import * as walletServices from '@entities/services/wallet'
import * as styleguide from '@kpmg/styleguide'
import { nextTick } from 'vue'
import CollabDetailsDrawer from '.'

const mockedCollaborators = getMockedCollaborators()
const formattedMockedCollaborators = getFormattedMockedCollaborators()

const collabDetails = formattedMockedCollaborators[0]
const { lastName, firstName, email, mobilePhone, landPhone } = collabDetails
const mockedInputs = [
  { name: 'lastName', value: lastName.toUpperCase(), isDisabled: true },
  { name: 'firstName', value: firstName, isDisabled: true },
  { name: 'email', value: email, isDisabled: true },
  { name: 'mobilePhone', value: mobilePhone, isDisabled: false },
  { name: 'landPhone', value: landPhone, isDisabled: false },
]
const mockedPatchGateway = vi.fn(() => {
  return Promise.resolve({
    data: mockedCollaborators[0],
  })
})

vi.mock('@entities/services/wallet', () => ({
  updateCollaborator: vi.fn(),
}))
vi.mock('@kpmg/styleguide', async () => {
  const styleguide = (await vi.importActual('@kpmg/styleguide')) as Record<
    string,
    unknown
  >
  return {
    ...styleguide,
    PNotification: vi.fn(),
  }
})
vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      patch: mockedPatchGateway,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
  debounce: (callback: Function) => callback,
}))

const createWrapper = (): VueWrapper =>
  mount(CollabDetailsDrawer, {
    props: {
      collabDetails,
      modelValue: true,
    },
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot/><slot name="footer"/></div>',
          events: ['close-drawer-button'],
        },
      },
    },
  })

const getInputs = (wrapper: VueWrapper) => wrapper.findAll('input')
const getButtonSubmit = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=collab-form-submit-button]')

describe('collabDetailsDrawer', () => {
  let wrapper: VueWrapper
  let spyPNotification: MockInstance
  beforeEach(() => {
    spyPNotification = vi.spyOn(styleguide, 'PNotification')
    wrapper = createWrapper()
  })

  it('should display the user card correctly with the appropriate role tag', () => {
    const pTag = wrapper.findComponent({ name: 'PTag' })
    const pUserTag = wrapper.findComponent({ name: 'PUserCard' })

    expect(pTag.props('pContent')).toBe(collabDetails.role)
    expect(pUserTag.props('pTitle')).toBe(collabDetails.fullName)
    expect(pUserTag.props('pSubtitle')).toBe(
      formattedMockedCollaborators[0].email,
    )
  })

  it.each(mockedInputs)('should prefill the value for input %#', (input) => {
    expect(
      (
        getInputs(wrapper)[mockedInputs.indexOf(input)]
          .element as HTMLInputElement
      ).value,
    ).toBe(input.value)
  })

  it.each(mockedInputs.filter(({ isDisabled }) => isDisabled))(
    'should have some inputs disabled, including checking input %#',
    (input) => {
      expect(
        getInputs(wrapper)[mockedInputs.indexOf(input)].attributes().disabled,
      ).toBeDefined()
    },
  )

  it.each(mockedInputs.filter(({ isDisabled }) => !isDisabled))(
    'should not have some inputs disabled, including checking input %#',
    (input) => {
      expect(
        getInputs(wrapper)[mockedInputs.indexOf(input)].attributes().disabled,
      ).toBeUndefined()
    },
  )

  it('should display a success notification when the collaborator details are updated', async () => {
    const spyUpdateCollaborator = vi.spyOn(walletServices, 'updateCollaborator')
    expect(spyPNotification).not.toHaveBeenCalled()

    await getButtonSubmit(wrapper).trigger('click')
    await flushPromises()

    expect(spyPNotification).toHaveBeenCalledOnce()
    expect(spyUpdateCollaborator).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update-collaborator-details')).toBeTruthy()
  })

  it('should display an error notification when the collaborator details fail to update', async () => {
    vi.spyOn(walletServices, 'updateCollaborator').mockRejectedValue(
      'API Error',
    )
    expect(spyPNotification).not.toHaveBeenCalled()

    await getButtonSubmit(wrapper).trigger('click')
    await flushPromises()

    expect(spyPNotification).toHaveBeenCalledOnce()
  })

  it('should emit the \'update:modelValue\' event when the drawer is closed', async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    pDrawer.vm.$emit('close-drawer-button', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('should emit the \'update:modelValue\' event when the v-model is updated', async () => {
    const drawer = wrapper.findComponent({ name: 'PDrawer' })
    drawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('should emit an update event and close the drawer when the cancel button is clicked', async () => {
    const formCancelButton = wrapper.find(
      '[data-testid=collab-form-cancel-button]',
    )
    await formCancelButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  const enabledInputs = mockedInputs.filter(({ isDisabled }) => !isDisabled)
  it.each(enabledInputs)(
    'should have control over the $name input',
    async (enabledInputs) => {
      const input = getInputs(wrapper)[mockedInputs.indexOf(enabledInputs)]
      const getButtonSubmitAttrDisabled = () =>
        getButtonSubmit(wrapper).attributes('disabled')

      expect(getButtonSubmitAttrDisabled()).toBeUndefined()

      await input?.setValue('not digit value')
      await flushPromises()

      expect(getButtonSubmitAttrDisabled()).toBeDefined()

      await input?.setValue('1234567890')
      await flushPromises()

      expect(getButtonSubmitAttrDisabled()).toBeUndefined()
    },
  )
})
