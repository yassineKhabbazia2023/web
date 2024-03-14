import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import mock from './mock.json'
import CollabRole from './'

let wrapper: VueWrapper<any>

const createWrapper = (): VueWrapper<any> =>
  mount(CollabRole, {
    attachTo: document.body
  })

describe('collabRole', () => {
  beforeEach(() => {
    const drawerFooter = document.createElement('div')
    drawerFooter.classList.add('el-drawer__footer')
    document.body.appendChild(drawerFooter)

    wrapper = createWrapper()
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })

  it('shows multiple roles', () => {
    const radioCards = wrapper.findAll('.p-radio-card')
    expect(radioCards).toHaveLength(mock.data.length)
  })

  it('has a role pre selected', () => {
    const roleSelected = mock.data.find(({ selected }) => selected)
    const radioCardSelected = wrapper.find('.p-radio-card .el-radio.is-checked input')
    expect((radioCardSelected.element as HTMLInputElement).value).toBe(roleSelected?.id.toString())
  })

  it('can close the drawer by emitting setDrawerNotVisible', () => {
    expect(wrapper.emitted()).toStrictEqual({})

    const buttonCancel = document.querySelector('.el-drawer__footer button') as HTMLButtonElement
    buttonCancel.click()

    expect(wrapper.emitted().setDrawerNotVisible).toHaveLength(1)
  })

  it('emits an event setSelectedRoleId on submit', () => {
    expect(wrapper.emitted()).toStrictEqual({})

    const buttonSubmit = document.querySelectorAll('.el-drawer__footer button')[1] as HTMLButtonElement
    buttonSubmit.click()

    expect(wrapper.emitted().setSelectedRoleId).toHaveLength(1)

    const expectedRoleSelected = mock.data.find(({ selected }) => selected)?.id
    expect(wrapper.emitted().setSelectedRoleId[0]).toStrictEqual([expectedRoleSelected])
  })
})

