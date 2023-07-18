import { VueWrapper } from '@vue/test-utils'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import { describe, it, expect } from 'vitest'
import PNavbar from './PNavbar.vue'

const createWrapper = (props: any = {}) =>
  wrapperFactory(PNavbar, {
    props
  })

describe('display navbar', () => {
  const entities = [
    { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount' },
    { name: 'Jean Levage', idAccount: 'idAccount 2' }
  ]

  const wrapper: VueWrapper<any> = createWrapper({ entities })

  it('should display vertical navbar with entities list', () => {
    const elMenu = wrapper.find('.el-menu-vertical-demo')
    const elMenuItems = elMenu.findAll('el-menu-item')
    expect(elMenu.exists()).toBeTruthy()
    expect(elMenuItems).toHaveLength(4)
    expect(elMenuItems[2].find('span').html()).contains('Restaurant Johnny s pizza')
    expect(elMenuItems[3].find('span').html()).contains('Jean Levage')
  })
})

