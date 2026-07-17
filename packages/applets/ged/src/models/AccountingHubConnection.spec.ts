import { envVarsMock } from '@pulse/common/mocks'

const constructorHubUrlMock = vi.hoisted(() => vi.fn())
const startConnectionMock = vi.hoisted(() => vi.fn())
const invokeMock = vi.hoisted(() => vi.fn())
const getConnectionMock = vi.hoisted(() => vi.fn())

// Own spec of the hubbed data-stream singleton: unmock it so the module
// really evaluates. Its collaborators stay on the vitest.setup.ts hubs
// (toolbox logger, env-vars); only the SUT-local connection class is mocked
// here (doctrine: shared-hubs).
// eslint-disable-next-line no-restricted-syntax -- doctrine: contested-modules (own-spec of the hubbed singleton escapes the project hub to evaluate the real module)
vi.unmock('@ged/models/AccountingHubConnection')

// eslint-disable-next-line no-restricted-syntax -- doctrine: async-registry (SUT-local class mock tied to this spec's vi.resetModules flow; a setup-level spy-wrap would re-wrap a fresh module namespace each registry generation)
vi.mock('./DataStreamHubConnection', () => {
  class DataStreamHubConnectionMock {
    constructor(hubUrl: string) {
      constructorHubUrlMock(hubUrl)
    }

    startConnection = startConnectionMock
    getConnection = getConnectionMock
  }

  return {
    DataStreamHubConnection: DataStreamHubConnectionMock,
  }
})

async function importModule() {
  vi.resetModules()
  const module = await import('./AccountingHubConnection')
  // The registry reset re-evaluates '@pulse/toolbox/mocks' the next time the
  // toolbox hub factory runs: in a shared worker the fresh SUT can bind to a
  // newer loggerMock instance than the one this spec would import at load
  // time. Resolve the logger from the same registry generation as the SUT
  // (doctrine: async-registry).
  const { logger } = await import('@pulse/toolbox')
  return { module, loggerMock: vi.mocked(logger, true) }
}

describe('AccountingHubConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    startConnectionMock.mockResolvedValue(undefined)
    getConnectionMock.mockReturnValue({
      invoke: invokeMock,
    })
    invokeMock.mockResolvedValue(undefined)
  })

  it('starts the connection during module initialization', async () => {
    const { module } = await importModule()

    expect(constructorHubUrlMock).toHaveBeenCalledExactlyOnceWith(envVarsMock.VITE_ACCOUNTING_HUB_URL)
    expect(startConnectionMock).toHaveBeenCalledOnce()
    expect(module.initializedAccountingDataStreamInstance).toBeDefined()
  })

  it('calls OnConnectedAsync with stringified folder id', async () => {
    const { module } = await importModule()

    module.initializedAccountingDataStreamInstance.OnConnectedAsync(12)

    expect(invokeMock).toHaveBeenCalledExactlyOnceWith('OnConnectedAsync', '12')
  })

  it('logs invoke errors for OnDisconnectedAsync', async () => {
    const { module, loggerMock } = await importModule()
    const error = new Error('invoke failed')
    invokeMock.mockRejectedValueOnce(error)

    module.initializedAccountingDataStreamInstance.OnDisconnectedAsync(77)
    await Promise.resolve()

    expect(invokeMock).toHaveBeenCalledExactlyOnceWith('OnDisconnectedAsync', '77')
    expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith('Invoke OnDisconnectedAsync failed:', error)
  })
})
