import type { LocationQuery, RouteLocationNamedRaw } from 'vue-router'
import type { RedirectActionResolver } from '@pulse/common/types'
import { loggerMock } from '@pulse/toolbox/mocks'
import { RouteName } from '@pulse/common/enums'
import { RedirectActionRegistry } from './redirect-action.registry'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

const ACTION = 'some-action'

beforeEach(() => {
  RedirectActionRegistry.clear()
})

describe('RedirectActionRegistry.register', () => {
  it('should store a resolver under its action key', async () => {
    const destination: RouteLocationNamedRaw = { name: RouteName.LANDING }
    const resolver: RedirectActionResolver = vi.fn().mockResolvedValue(destination)

    RedirectActionRegistry.register(ACTION, resolver)
    const result = await RedirectActionRegistry.resolve({ action: ACTION })

    expect(result).toBe(destination)
  })

  it('should warn and overwrite when the same action is registered twice', async () => {
    const first: RedirectActionResolver = vi.fn().mockResolvedValue(null)
    const second: RedirectActionResolver = vi.fn().mockResolvedValue({ name: RouteName.LANDING })

    RedirectActionRegistry.register(ACTION, first)
    RedirectActionRegistry.register(ACTION, second)
    await RedirectActionRegistry.resolve({ action: ACTION })

    expect(loggerMock.warn).toHaveBeenCalledWith(
      `[RedirectActionRegistry] Overwriting resolver for action "${ACTION}"`,
    )
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })
})

describe('RedirectActionRegistry.resolve', () => {
  it('should return null and warn when action query param is missing', async () => {
    const result = await RedirectActionRegistry.resolve({})

    expect(result).toBeNull()
    expect(loggerMock.warn).toHaveBeenCalledWith('[RedirectActionRegistry] Missing or empty "action" query param')
  })

  it('should return null and warn when action is unknown', async () => {
    const result = await RedirectActionRegistry.resolve({ action: 'unknown-action' })

    expect(result).toBeNull()
    expect(loggerMock.warn).toHaveBeenCalledWith('[RedirectActionRegistry] Unknown redirect action: "unknown-action"')
  })

  it('should invoke the matching resolver with the incoming query and return its destination', async () => {
    const destination: RouteLocationNamedRaw = { name: RouteName.LANDING, query: { foo: 'bar' } }
    const resolver: RedirectActionResolver = vi.fn().mockResolvedValue(destination)
    const query: LocationQuery = { action: ACTION, foo: 'bar' }

    RedirectActionRegistry.register(ACTION, resolver)
    const result = await RedirectActionRegistry.resolve(query)

    expect(resolver).toHaveBeenCalledExactlyOnceWith(query)
    expect(result).toBe(destination)
  })

  it('should use the first value when the action query param is an array', async () => {
    const destination: RouteLocationNamedRaw = { name: RouteName.LANDING }
    const resolver: RedirectActionResolver = vi.fn().mockResolvedValue(destination)

    RedirectActionRegistry.register(ACTION, resolver)
    const result = await RedirectActionRegistry.resolve({ action: [ACTION, 'other'] })

    expect(resolver).toHaveBeenCalledOnce()
    expect(result).toBe(destination)
  })

  it('should forward null from the resolver', async () => {
    const resolver: RedirectActionResolver = vi.fn().mockResolvedValue(null)

    RedirectActionRegistry.register(ACTION, resolver)
    const result = await RedirectActionRegistry.resolve({ action: ACTION })

    expect(result).toBeNull()
  })
})

describe('RedirectActionRegistry.unregister', () => {
  it('should remove a previously registered resolver', async () => {
    const resolver: RedirectActionResolver = vi.fn().mockResolvedValue({ name: RouteName.LANDING })

    RedirectActionRegistry.register(ACTION, resolver)
    RedirectActionRegistry.unregister(ACTION)
    const result = await RedirectActionRegistry.resolve({ action: ACTION })

    expect(result).toBeNull()
    expect(resolver).not.toHaveBeenCalled()
  })

  it('should be a no-op when the action was never registered', () => {
    expect(() => RedirectActionRegistry.unregister('never-registered')).not.toThrow()
  })

  it('should not affect other registered resolvers', async () => {
    const otherDestination: RouteLocationNamedRaw = { name: RouteName.LANDING }
    const targetResolver: RedirectActionResolver = vi.fn().mockResolvedValue(null)
    const otherResolver: RedirectActionResolver = vi.fn().mockResolvedValue(otherDestination)

    RedirectActionRegistry.register(ACTION, targetResolver)
    RedirectActionRegistry.register('other-action', otherResolver)
    RedirectActionRegistry.unregister(ACTION)

    const result = await RedirectActionRegistry.resolve({ action: 'other-action' })

    expect(result).toBe(otherDestination)
  })
})

describe('RedirectActionRegistry.clear', () => {
  it('should remove all registered resolvers', async () => {
    const firstResolver: RedirectActionResolver = vi.fn().mockResolvedValue({ name: RouteName.LANDING })
    const secondResolver: RedirectActionResolver = vi.fn().mockResolvedValue({ name: RouteName.LANDING })

    RedirectActionRegistry.register(ACTION, firstResolver)
    RedirectActionRegistry.register('other-action', secondResolver)
    RedirectActionRegistry.clear()

    const firstResult = await RedirectActionRegistry.resolve({ action: ACTION })
    const secondResult = await RedirectActionRegistry.resolve({ action: 'other-action' })

    expect(firstResult).toBeNull()
    expect(secondResult).toBeNull()
    expect(firstResolver).not.toHaveBeenCalled()
    expect(secondResolver).not.toHaveBeenCalled()
  })

  it('should be a no-op when the registry is already empty', () => {
    expect(() => RedirectActionRegistry.clear()).not.toThrow()
  })
})
