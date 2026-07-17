import { LogLevel } from '@microsoft/signalr'
import { HubConnectionBuilderMock } from '@pulse/common/mocks/vitest'

import { getNewHubConnection } from './DataStreamHubConnectionHelper'

const withUrlMock = vi.fn()
const configureLoggingMock = vi.fn()
const withAutomaticReconnectMock = vi.fn()
const buildMock = vi.fn()

const hubConnectionBuilderMock = {
  withUrl: withUrlMock,
  configureLogging: configureLoggingMock,
  withAutomaticReconnect: withAutomaticReconnectMock,
  build: buildMock,
}

describe('getNewHubConnection', () => {
  beforeEach(() => {
    HubConnectionBuilderMock.mockImplementation(function() {
      return hubConnectionBuilderMock
    })
    withUrlMock.mockReturnValue(hubConnectionBuilderMock)
    configureLoggingMock.mockReturnValue(hubConnectionBuilderMock)
    withAutomaticReconnectMock.mockReturnValue(hubConnectionBuilderMock)
    buildMock.mockReturnValue('connection-instance')
  })

  it('builds a signalR connection with hub url and token', () => {
    const result = getNewHubConnection('hub-url', 'token-value')

    expect(HubConnectionBuilderMock).toHaveBeenCalledOnce()
    expect(withUrlMock).toHaveBeenCalledOnce()
    expect(configureLoggingMock).toHaveBeenCalledExactlyOnceWith(LogLevel.Information)
    expect(withAutomaticReconnectMock).toHaveBeenCalledOnce()
    expect(buildMock).toHaveBeenCalledOnce()
    expect(result).toBe('connection-instance')

    const [receivedUrl, options] = withUrlMock.mock.calls[0]
    expect(receivedUrl).toBe('hub-url')
    expect(options.accessTokenFactory()).toBe('token-value')
  })
})
