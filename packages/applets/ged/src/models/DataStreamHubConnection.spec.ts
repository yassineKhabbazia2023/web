import type { HubConnection } from '@microsoft/signalr'
import { loggerMock } from '@pulse/toolbox/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useTokenStore } from '@pulse/common/stores'
import { getNewHubConnection } from './DataStreamHubConnectionHelper'

import { DataStreamHubConnection } from './DataStreamHubConnection'

const startMock = vi.fn()
const stopMock = vi.fn()
const tokenStoreMock = getStoreMock(useTokenStore)

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
    tokenStoreMock.getToken.mockReturnValue('token')
    vi.mocked(getNewHubConnection).mockReturnValue(createHubConnectionMock())
  })

  it('initializes with token store value', () => {
    const instance = createInstance()

    expect(tokenStoreMock.getToken).toHaveBeenCalledOnce()
    expect(vi.mocked(getNewHubConnection)).toHaveBeenCalledExactlyOnceWith('hub-url', 'token')
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

    expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith('Hub connection to hub-url failed', error)
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

    expect(loggerMock.error).toHaveBeenCalledWith(error)
  })
})
