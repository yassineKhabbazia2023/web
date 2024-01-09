import { describe, beforeEach, it, expect } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import type { PTableColumnProps } from './PTableColumnTypes'
import PTable from '@/atoms/PTable'
import PTableColumn from '.'

function createWrapper(
  columns: PTableColumnProps[],
  pData: any,
  pStripe: boolean
): VueWrapper {
  const Component = {
    template: `
      <PTable :pData="pData" :pStripe="pStripe">
        <PTableColumn
          v-for="(column, index) in columns"
          :key="index"
          :pType="column.pType"
          :pLabel="column.pLabel"
          :pProp="column.pProp"
          data-ut="column"
        >
          <template
            #default="{ row, column, $index }"
          >
            <span>{{ row[column.property] }}</span>
          </template>
        </PTableColumn>
      </PTable>
    `,
    data() {
      return {
        columns,
        pData,
        pStripe
      }
    }
  }

  return mount(Component, {
    global: {
      components: {
        PTable,
        PTableColumn
      }
    }
  })
}

const pData = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 22, name: 'Jane Smith', age: 25 },
  { id: 357, name: 'Paul Simon', age: 84 }
]

const columns: PTableColumnProps[] = [{
  pType: 'selection'
}, {
  pLabel: 'Name',
  pProp: 'name'
}, {
  pType: 'index',
  pProp: 'id'
}, {
  pLabel: 'age',
  pProp: 'age'
}]

describe('pTableColumn', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(async () => {
    wrapper = createWrapper(columns, pData, false)
    await flushPromises()
  })
  it('should have column count', () => {
    const columns = wrapper.findAll('[data-ut="column"]')
    expect(columns).toHaveLength(columns.length)
  })

  it('columns should have proper thead texts', () => {
    const thead = wrapper.find('thead')
    const expectedHeadText = columns.map(({ pLabel }) => pLabel).join('')
    expect(thead.text()).toBe(expectedHeadText)
  })
  it('columns should have proper tbody texts', () => {
    const tbody = wrapper.find('tbody')
    const expectedBodyText = pData
      .map(({ name, age, id }) => `${name}${id}${age}`)
      .join('')

    expect(tbody.text()).toBe(expectedBodyText)
  })
})
