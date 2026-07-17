import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import {
  getMockedCollaborators,
  getFormattedMockedCollaborators,
} from '@entities/__mocks__/collaborators.mocks'
import { updateCollaborator } from '@entities/services/collaborator'

import { restoreRealUseI18n } from '@pulse/common/mocks/vitest'

import CollabDetailsDrawer from '.'

const mockedCollaborators = getMockedCollaborators()
const formattedMockedCollaborators = getFormattedMockedCollaborators()

const collabDetails = formattedMockedCollaborators[0]
const { lastName, firstName, email, mobilePhone, landPhone } = collabDetails
const mockedInputs = [
  { name: 'lastName', value: lastName.toUpperCase(), isDisabled: true },
  { name: 'firstName', value: firstName, isDisabled: true },
  { name: 'email', value: email, isDisabled: true },
  { name: 'mobilePhone', value: mobilePhone, isDisabled: true },
  { name: 'landPhone', value: landPhone, isDisabled: false },
]
beforeEach(() => {
  restoreRealUseI18n()
  vi.mocked(updateCollaborator).mockResolvedValue(mockedCollaborators[0])
})

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
  beforeEach(() => {
    wrapper = createWrapper()
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

  const enabledInputs = mockedInputs.filter(({ isDisabled }) => !isDisabled)
  it.each(enabledInputs)(
    'should have control over the $name input',
    async (enabledInputs) => {
      // The real toolbox useDebounce delays the submit-button state: drive it
      // with fake timers instead of relying on a pass-through debounce mock.
      vi.useFakeTimers()
      const input = getInputs(wrapper)[mockedInputs.indexOf(enabledInputs)]
      const getButtonSubmitAttrDisabled = () =>
        getButtonSubmit(wrapper).attributes('disabled')

      expect(getButtonSubmitAttrDisabled()).toBeUndefined()

      await input?.setValue('not digit value')
      await vi.advanceTimersByTimeAsync(600)
      await nextTick()

      expect(getButtonSubmitAttrDisabled()).toBeDefined()

      await input?.setValue('1234567890')
      await vi.advanceTimersByTimeAsync(600)
      await nextTick()

      expect(getButtonSubmitAttrDisabled()).toBeUndefined()
      vi.useRealTimers()
    },
  )
})
