/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, type MockInstance } from 'vitest'
import { DataStreamHubConnection } from './DataStreamHubConnection'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import * as DataStreamHubConnectionHelper from './DataStreamHubConnectionHelper'
import type { HubConnection } from '@microsoft/signalr'

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
    let errorSpy: MockInstance
    beforeEach(() => {
      errorSpy = vi.spyOn(console, 'error')
    })
    it('should call console.error when start connection fails', async () => {
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
      expect(errorSpy).toHaveBeenCalledOnce()
      expect(errorSpy).toHaveBeenNthCalledWith(1, `Hub connection to ${mockHubUrl} failed`, 'error')
    })

    it('should call console.error when destroyConnection connection fails', async () => {
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
      expect(errorSpy).toHaveBeenCalledOnce()
      expect(errorSpy).toHaveBeenNthCalledWith(1, 'error')
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
      expect(errorSpy).not.toHaveBeenCalledOnce()
    })
  })
})
