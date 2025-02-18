import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EntityHeader from '.'
import type { EntityHeaderProps } from './entity-header.types'

const baseProps: EntityHeaderProps = {
  legalName: 'Au5',
  accountNumber: '777777777',
}

const wrapper = shallowMount(EntityHeader, {
  props: baseProps,
  global: {
    stubs: {
      PAvatar: {
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('entity header', () => {
  it('should renders correctly', async () => {
    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/EntityHeader.snap')
  })
})
