import { shallowMount } from '@vue/test-utils'
import PTable from './'
import { describe, it, expect } from 'vitest'

function createWrapper(pData: any, pStripe = false, pFit = false) {
  const wrapper = shallowMount(PTable, {
    props: {
      pData,
      pStripe,
      pFit,
    },
    global: {
      stubs: {
        ElTable: {
          name: 'ElTable',
          template: `<table>
          <tbody>
          <tr v-for="(row, index) in data" :key="index"><td />
          </tr>
          </tbody>
          </table>`,
          props: [
            'data',
            'stripe',
            'fit',
          ],
        },
      },
    },
  })

  return wrapper
}

describe('pTable', () => {
  // Define a sample data for testing
  const testData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    // Add more test data if needed
  ]

  it('renders the table with provided data', () => {
    const wrapper = createWrapper(testData)

    // Check if the table renders correctly
    const tableElement = wrapper.findComponent({ name: 'ElTable' })

    expect(tableElement.exists()).toBeTruthy()

    // Check if the data is rendered correctly in the table
    const rows = wrapper.findAll('tbody > tr')
    expect(rows).toHaveLength(testData.length)
  })

  it('applies the stripe class when stripe prop is true', () => {
    const wrapper = createWrapper(testData, true, true)

    // Check if the stripe class is applied to the table
    const elTable = wrapper.findComponent({ name: 'ElTable' })
    const elTableProps = elTable.props()
    expect(elTableProps.stripe).toBeTruthy()
    expect(elTableProps.fit).toBeTruthy()
  })
})
