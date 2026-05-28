import productFruitsPlugin from './product-fruits.plugin.install'
import { productFruitStatus } from './product-fruits.plugin.state'

describe('Product Fruits Plugin Install', () => {
  beforeEach(() => {
    productFruitStatus.isActive = false
    productFruitStatus.isInitialized = true
  })

  it('should set isActive to true and isInitialized to false when installed with isActive true', () => {
    productFruitsPlugin.install({} as any, { isActive: true })

    expect(productFruitStatus.isActive).toBe(true)
    expect(productFruitStatus.isInitialized).toBe(false)
  })

  it('should set isActive to false and isInitialized to false when installed with isActive false', () => {
    productFruitsPlugin.install({} as any, { isActive: false })

    expect(productFruitStatus.isActive).toBe(false)
    expect(productFruitStatus.isInitialized).toBe(false)
  })
})
