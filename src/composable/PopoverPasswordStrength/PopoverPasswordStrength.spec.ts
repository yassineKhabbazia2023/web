import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PopoverPasswordStrength from './'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

const createWrapper = (mdp: string) =>
  mount(PopoverPasswordStrength, {
    attachTo: document.body,
    props: {
      password: mdp
    }
  })

describe('popover password strength', () => {
  it('should show popover when user enter password', async () => {
    createWrapper('aaAA')
    await waitForAsyncImports(30)
    expect(document.body.innerHTML).contains('el-popover')
  })
  it('should show level Weak when user enter password which length < 8', async () => {
    createWrapper('aaAA')
    await waitForAsyncImports(30)
    expect(document.body.innerHTML).contains('Weak')
  })
  it('should show level Weak when user enter password with weak condition', async () => {
    createWrapper('aaAA@@')
    await waitForAsyncImports(30)
    expect(document.body.innerHTML).contains('Weak')
  })
  it('should show level Average when user enter password with average condition', async () => {
    createWrapper('aaAA22ss')
    await waitForAsyncImports(30)
    expect(document.body.innerHTML).contains('Average')
  })
  it('should show level Strong when user enter password with Strong condition', async () => {
    createWrapper('aaAA11@@')
    await waitForAsyncImports(30)
    expect(document.body.innerHTML).contains('Strong')
  })
})
