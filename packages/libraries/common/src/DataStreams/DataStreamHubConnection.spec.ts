
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataStreamHubConnection } from './DataStreamHubConnection'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import * as DataStreamHubConnectionHelper from './DataStreamHubConnectionHelper'
import type { HubConnection } from '@microsoft/signalr'

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@microsoft/signalr')
vi.mock('./DataStreamHubConnectionHelper', () => {
  return {
    getNewHubConnection: () => ({
      start: vi.fn().mockResolvedValue({}),
      stop: vi.fn().mockResolvedValue({}),
    }),
  }
})

describe('dataStreamHubConnection', () => {
  let dataStreamHubConnection: DataStreamHubConnection
  const mockHubUrl = 'https://mockurl.com'

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createTestingPinia())
    dataStreamHubConnection = new DataStreamHubConnection(mockHubUrl)
  })

  it('should start the connection', async () => {
    await dataStreamHubConnection.startConnection()
    expect(dataStreamHubConnection.getConnection().start).toHaveBeenCalledWith()
  })

  it('should set isConnected to true after starting the connection', async () => {
    await dataStreamHubConnection.startConnection()
    expect(dataStreamHubConnection.getIsConnected()).toBeTruthy()
  })

  it('should stop the connection when destroyed', async () => {
    await dataStreamHubConnection.startConnection()
    await dataStreamHubConnection.destroyConnection()
    expect(dataStreamHubConnection.getConnection().stop).toHaveBeenCalledWith()
  })

  it('should set isConnected to false after destroying the connection', async () => {
    await dataStreamHubConnection.startConnection()
    await dataStreamHubConnection.destroyConnection()
    const isConnected = dataStreamHubConnection.getIsConnected()
    expect(isConnected).toBeFalsy()
  })

  describe('when connection fails', () => {
    it('should call logger.error when start connection fails', async () => {
      vi
        .spyOn(DataStreamHubConnectionHelper, 'getNewHubConnection')
        .mockImplementationOnce((_hubUrl: string, _userToken: string) => {
          return {
            start: vi.fn().mockRejectedValueOnce('error'),
            stop: vi.fn(),
          } as unknown as HubConnection
        })
      dataStreamHubConnection = new DataStreamHubConnection(mockHubUrl)
      await dataStreamHubConnection.startConnection()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, `Hub connection to ${mockHubUrl} failed`, 'error')
    })

    it('should call logger.error when destroyConnection connection fails', async () => {
      vi
        .spyOn(DataStreamHubConnectionHelper, 'getNewHubConnection')
        .mockImplementationOnce((_hubUrl: string, _userToken: string) => {
          return {
            start: vi.fn().mockResolvedValue({}),
            stop: vi.fn().mockRejectedValueOnce('error'),
          } as unknown as HubConnection
        })
      dataStreamHubConnection = new DataStreamHubConnection(mockHubUrl)
      await dataStreamHubConnection.startConnection()
      await dataStreamHubConnection.destroyConnection()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'error')
    })

    it('should do nothing when not connected', async () => {
      vi
        .spyOn(DataStreamHubConnectionHelper, 'getNewHubConnection')
        .mockImplementationOnce((_hubUrl: string, _userToken: string) => {
          return {
            start: vi.fn(),
            stop: vi.fn(),
          } as unknown as HubConnection
        })
      dataStreamHubConnection = new DataStreamHubConnection(mockHubUrl)
      await dataStreamHubConnection.destroyConnection()
      expect(loggerErrorSpy).not.toHaveBeenCalledOnce()
    })
  })
})
