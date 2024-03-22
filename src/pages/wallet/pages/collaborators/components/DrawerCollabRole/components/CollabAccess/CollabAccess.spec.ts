import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import mock from './mock.json'
import CollabAccess from './'

const SELECTED_COLLAB_ROLE = 'a custom role'

let wrapper: VueWrapper<any>

const createWrapper = (): VueWrapper<any> =>
  mount(CollabAccess, {
    props: {
      selectedCollabRole: SELECTED_COLLAB_ROLE,
    },
    attachTo: document.body,
  })

describe('collabAccess', () => {
  beforeEach(() => {
    const drawerFooter = document.createElement('div')
    drawerFooter.classList.add('el-drawer__footer')
    document.body.appendChild(drawerFooter)

    wrapper = createWrapper()
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })

  it('displays the role of the selected collaborator', () => {
    expect(wrapper.text()).toContain(SELECTED_COLLAB_ROLE)
  })

  it('shows multiple access', () => {
    const accesses = wrapper.findAll('.el-form-item')
    expect(accesses).toHaveLength(mock.data.length)
  })

  it('can go to the previous step', () => {
    expect(wrapper.emitted()).toStrictEqual({})

    const buttonPrevious = document.querySelector('.el-drawer__footer button') as HTMLButtonElement
    buttonPrevious.click()

    expect(wrapper.emitted().goToPreviousStep).toHaveLength(1)
  })

  it('emits an event setAccesses when submitting the form', () => {
    const formValues = mock.data
      .map(({ id, selected }: { id: number, selected: boolean }) => ({ [id]: selected }))
    const expected = Object.assign({}, ...formValues)

    expect(wrapper.emitted()).toStrictEqual({})

    const buttonSubmit = document.querySelectorAll('.el-drawer__footer button')[1] as HTMLButtonElement
    buttonSubmit.click()

    expect(wrapper.emitted().setAccesses).toHaveLength(1)
    expect(wrapper.emitted().setAccesses[0]).toStrictEqual([expected])
  })
})
