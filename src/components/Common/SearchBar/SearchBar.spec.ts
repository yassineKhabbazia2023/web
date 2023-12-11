import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import SearchBar from '.'
import { expect, describe, it } from 'vitest'

const createWrapper = (props:any) =>
  wrapperFactory(SearchBar, { props })

describe('serach bar mandate', () => {
  const wrapper = createWrapper({ modelValue: null })
  it('should emit the value just once', async () => {
    const inputValue = 'BNP Paribas'
    const ibsInputElement = wrapper
      .find('input[data-testid="search-mandate-test"]')
    await ibsInputElement
      .setValue(inputValue)
    await ibsInputElement.trigger('change')
    const modelValueEvent: any = wrapper.emitted('update:modelValue')
    expect(modelValueEvent[0]).toStrictEqual([inputValue])
  })
})
