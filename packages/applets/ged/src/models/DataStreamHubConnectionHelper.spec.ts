import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getNewHubConnection } from './DataStreamHubConnectionHelper'

const withUrlMock = vi.hoisted(() => vi.fn())
const configureLoggingMock = vi.hoisted(() => vi.fn())
const withAutomaticReconnectMock = vi.hoisted(() => vi.fn())
const buildMock = vi.hoisted(() => vi.fn())
const hubConnectionBuilderConstructorMock = vi.hoisted(() => vi.fn())

vi.mock('@microsoft/signalr', () => {
  const builder = {
    withUrl: withUrlMock,
    configureLogging: configureLoggingMock,
    withAutomaticReconnect: withAutomaticReconnectMock,
    build: buildMock,
  }

  withUrlMock.mockReturnValue(builder)
  configureLoggingMock.mockReturnValue(builder)
  withAutomaticReconnectMock.mockReturnValue(builder)
  hubConnectionBuilderConstructorMock.mockImplementation(function HubConnectionBuilderMock() {
    return builder
  })

  return {
    HubConnectionBuilder: hubConnectionBuilderConstructorMock,
    LogLevel: {
      Information: 'Information',
    },
  }
})

describe('getNewHubConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const builder = {
      withUrl: withUrlMock,
      configureLogging: configureLoggingMock,
      withAutomaticReconnect: withAutomaticReconnectMock,
      build: buildMock,
    }
    withUrlMock.mockReturnValue(builder)
    configureLoggingMock.mockReturnValue(builder)
    withAutomaticReconnectMock.mockReturnValue(builder)
    hubConnectionBuilderConstructorMock.mockImplementation(function HubConnectionBuilderMock() {
      return builder
    })
    buildMock.mockReturnValue('connection-instance')
  })

  it('builds a signalR connection with hub url and token', () => {
    const result = getNewHubConnection('hub-url', 'token-value')

    expect(hubConnectionBuilderConstructorMock).toHaveBeenCalledOnce()
    expect(withUrlMock).toHaveBeenCalledOnce()
    expect(configureLoggingMock).toHaveBeenCalledExactlyOnceWith('Information')
    expect(withAutomaticReconnectMock).toHaveBeenCalledOnce()
    expect(buildMock).toHaveBeenCalledOnce()
    expect(result).toBe('connection-instance')

    const [receivedUrl, options] = withUrlMock.mock.calls[0]
    expect(receivedUrl).toBe('hub-url')
    expect(options.accessTokenFactory()).toBe('token-value')
  })
})
