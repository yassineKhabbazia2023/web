/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataStreamHubConnection } from './DataStreamHubConnection'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'

vi.mock('@microsoft/signalr')
vi.mock('./DataStreamHubConnectionHelper', () => {
  return {
    getNewHubConnection: () => ({
      start: vi.fn().mockResolvedValue({}),
      stop: vi.fn().mockResolvedValue({})
    })
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
})
