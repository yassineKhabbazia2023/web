import { expect, describe, it } from 'vitest'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import SearchBar from '.'

const createWrapper = (props:any) =>
  wrapperFactory(SearchBar, { props })

describe('serach bar mandate', () => {
  const wrapper = createWrapper({ modelValue: '' })
  it('should emit the value just once', async () => {
    const inputValue = 'BNP Paribas'
    const ibsInputElement = wrapper
      .find('input[data-testid="mandate-search-bar"]')
    await ibsInputElement
      .setValue(inputValue)
    await ibsInputElement.trigger('change')
    const modelValueEvent = wrapper.emitted('update:modelValue')

    expect(modelValueEvent?.at(0)).toStrictEqual([inputValue])
  })
})
