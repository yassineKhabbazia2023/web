import { createGlobalSetup } from './global-setup.helper'

describe('createGlobalSetup', () => {
  it('should return a function that fetches the given baseURL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())

    const globalSetup = createGlobalSetup('http://localhost:3000')
    await globalSetup()

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000')

    fetchSpy.mockRestore()
  })

  it('should also fetch additional routes when provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())

    const globalSetup = createGlobalSetup('http://localhost:3000', ['/app-settings', '/dashboard'])
    await globalSetup()

    expect(fetchSpy).toHaveBeenCalledTimes(3)
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000')
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/app-settings')
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/dashboard')

    fetchSpy.mockRestore()
  })

  it('should propagate fetch errors', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const globalSetup = createGlobalSetup('http://localhost:3000')

    await expect(globalSetup()).rejects.toThrow('Network error')

    fetchSpy.mockRestore()
  })
})
