// Import necessary modules
import { mount } from '@vue/test-utils'
import PTable from './'
import { ElTable } from 'element-plus'
import { describe, it, expect } from 'vitest'

describe('PTable', () => {
  // Define a sample data for testing
  const testData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 }
    // Add more test data if needed
  ]

  it('renders the table with provided data', () => {
    const wrapper = mount(PTable, {
      global: {
        components: {
          ElTable
        }
      },
      props: {
        data: testData
      }
    })

    // Check if the table renders correctly
    const tableElement = wrapper.findComponent({ name: 'ElTable' })

    expect(tableElement.exists()).toBe(true)

    // Check if the data is rendered correctly in the table
    const rows = wrapper.findAll('tbody > tr')
    expect(rows.length).toBe(testData.length)
  })

  it('applies the stripe class when stripe prop is true', () => {
    const wrapper = mount(PTable, {
      global: {
        components: {
          ElTable
        }
      },
      props: {
        data: testData,
        stripe: true
      }
    })

    // Check if the stripe class is applied to the table
    const tableElement = wrapper.findComponent({ name: 'ElTable' })
    expect(tableElement.classes()).toContain('el-table--striped')
  })
})
