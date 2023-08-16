import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableEntities from './'

describe('table-entities', () => {
  it('renders correctly', () => {
    const wrapper = mount(TableEntities)
    expect(wrapper.exists()).toBeTruthy()
  })
})
