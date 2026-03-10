import type { HubConnection } from '@microsoft/signalr'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { DataStreamHubConnection } from './DataStreamHubConnection'

const loggerErrorMock = vi.hoisted(() => vi.fn())
const getTokenMock = vi.hoisted(() => vi.fn())
const useTokenStoreMock = vi.hoisted(() => vi.fn())
const startMock = vi.hoisted(() => vi.fn())
const stopMock = vi.hoisted(() => vi.fn())
const getNewHubConnectionMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: loggerErrorMock,
  },
}))

vi.mock('@pulse/common/stores', () => ({
  useTokenStore: useTokenStoreMock,
}))

vi.mock('./DataStreamHubConnectionHelper', () => ({
  getNewHubConnection: getNewHubConnectionMock,
}))

function createHubConnectionMock(): HubConnection {
  return {
    start: startMock,
    stop: stopMock,
  } as unknown as HubConnection
}

function createInstance() {
  return new DataStreamHubConnection('hub-url')
}

describe('DataStreamHubConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getTokenMock.mockReturnValue('token')
    useTokenStoreMock.mockReturnValue({ getToken: getTokenMock })
    getNewHubConnectionMock.mockReturnValue(createHubConnectionMock())
  })

  it('initializes with token store value', () => {
    const instance = createInstance()

    expect(useTokenStoreMock).toHaveBeenCalledOnce()
    expect(getTokenMock).toHaveBeenCalledOnce()
    expect(getNewHubConnectionMock).toHaveBeenCalledExactlyOnceWith('hub-url', 'token')
    expect(instance.getIsConnected()).toBe(false)
  })

  it('sets connected state when startConnection succeeds', async () => {
    startMock.mockResolvedValue(undefined)
    const instance = createInstance()

    await instance.startConnection()

    expect(startMock).toHaveBeenCalledOnce()
    expect(instance.getIsConnected()).toBe(true)
  })

  it('logs an error when startConnection fails', async () => {
    const error = new Error('start failed')
    startMock.mockRejectedValue(error)
    const instance = createInstance()

    await instance.startConnection()

    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith('Hub connection to hub-url failed', error)
  })

  it('does not stop connection when instance is not connected', async () => {
    const instance = createInstance()

    await instance.destroyConnection()

    expect(stopMock).not.toHaveBeenCalled()
  })

  it('stops connection when instance is connected', async () => {
    startMock.mockResolvedValue(undefined)
    stopMock.mockResolvedValue(undefined)
    const instance = createInstance()
    await instance.startConnection()

    await instance.destroyConnection()

    expect(stopMock).toHaveBeenCalledOnce()
    expect(instance.getIsConnected()).toBe(false)
  })

  it('logs an error when stop connection fails', async () => {
    const error = new Error('stop failed')
    startMock.mockResolvedValue(undefined)
    stopMock.mockRejectedValue(error)
    const instance = createInstance()
    await instance.startConnection()

    await instance.destroyConnection()

    expect(loggerErrorMock).toHaveBeenCalledWith(error)
  })
})
