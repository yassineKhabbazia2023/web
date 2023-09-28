import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PopoverPasswordStrength from '.'
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

  const PARAM = [
    ['weak', 'aaAA@@', 'Weak'],
    ['average', 'aaAA22ss', 'Average'],
    ['strong', 'aaAA11@@', 'Strong']
  ]

  it.each(PARAM)(
    'should show level %s when user enter password',
    async (_condition, password, level) => {
      createWrapper(password)
      await waitForAsyncImports(30)
      expect(document.body.innerHTML).contains(level)
    }
  )
})
