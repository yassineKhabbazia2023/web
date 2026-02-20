import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import {
  getMockedCollaborators,
  getFormattedMockedCollaborators,
} from '@entities/__mocks__/collaborators.mocks'

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

vi.mock('@entities/services/collaborator', () => ({
  updateCollaborator: vi.fn(),
}))
const spyPNotification = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: spyPNotification,
}))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      patch: mockedPatchGateway,
    },
  }),
}))

vi.mock('@pulse/toolbox', () => ({
  useDebounce: (fn: any) => fn,
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
