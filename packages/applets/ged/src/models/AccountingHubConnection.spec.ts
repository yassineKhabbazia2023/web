import { describe, it, expect, vi, beforeEach } from 'vitest'

const loggerErrorMock = vi.hoisted(() => vi.fn())
const constructorHubUrlMock = vi.hoisted(() => vi.fn())
const startConnectionMock = vi.hoisted(() => vi.fn())
const invokeMock = vi.hoisted(() => vi.fn())
const getConnectionMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: loggerErrorMock,
  },
}))

vi.mock('env-vars', () => ({
  VITE_ACCOUNTING_HUB_URL: 'accounting-hub-url',
}))

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
  return await import('./AccountingHubConnection')
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
    const module = await importModule()

    expect(constructorHubUrlMock).toHaveBeenCalledExactlyOnceWith('accounting-hub-url')
    expect(startConnectionMock).toHaveBeenCalledOnce()
    expect(module.initializedAccountingDataStreamInstance).toBeDefined()
  })

  it('calls OnConnectedAsync with stringified folder id', async () => {
    const module = await importModule()

    module.initializedAccountingDataStreamInstance.OnConnectedAsync(12)

    expect(invokeMock).toHaveBeenCalledExactlyOnceWith('OnConnectedAsync', '12')
  })

  it('logs invoke errors for OnDisconnectedAsync', async () => {
    const module = await importModule()
    const error = new Error('invoke failed')
    invokeMock.mockRejectedValueOnce(error)

    module.initializedAccountingDataStreamInstance.OnDisconnectedAsync(77)
    await Promise.resolve()

    expect(invokeMock).toHaveBeenCalledExactlyOnceWith('OnDisconnectedAsync', '77')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith('Invoke OnDisconnectedAsync failed:', error)
  })
})
