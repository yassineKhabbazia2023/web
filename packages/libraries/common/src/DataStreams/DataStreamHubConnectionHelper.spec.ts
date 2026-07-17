import { getNewHubConnection } from './DataStreamHubConnectionHelper'
import { LogLevel } from '@microsoft/signalr'
import { HubConnectionBuilderMock } from '../__mocks__/vitest'

const HUB_URL = 'https://testhuburl.com'
const USER_TOKEN = 'testToken'

interface WithUrlOptions {
  accessTokenFactory: () => string
}

const withUrlMocked = vi.fn()
const configureLoggingMocked = vi.fn()
const withAutomaticReconnectMocked = vi.fn()
const buildMocked = vi.fn()

const hubConnectionBuilderMocked = {
  withUrl: withUrlMocked,
  configureLogging: configureLoggingMocked,
  withAutomaticReconnect: withAutomaticReconnectMocked,
  build: buildMocked,
}

describe('getNewHubConnection', () => {
  beforeEach(() => {
    HubConnectionBuilderMock.mockImplementation(function() {
      return hubConnectionBuilderMocked
    })
  })

  it('returns a HubConnection instance', () => {
    const hubConnectionMocked = 'hub-connection-mocked'
    const accessTokenFactoryCallbackSpy = vi.fn()

    withUrlMocked.mockImplementation((_url: string, options: WithUrlOptions) => {
      accessTokenFactoryCallbackSpy(options.accessTokenFactory())
      return hubConnectionBuilderMocked
    })
    configureLoggingMocked.mockReturnValue(hubConnectionBuilderMocked)
    withAutomaticReconnectMocked.mockReturnValue(hubConnectionBuilderMocked)
    buildMocked.mockReturnValue(hubConnectionMocked)

    const connection = getNewHubConnection(HUB_URL, USER_TOKEN)
    expect(connection).toStrictEqual(hubConnectionMocked)

    expect(withUrlMocked).toHaveBeenCalledExactlyOnceWith(HUB_URL, { accessTokenFactory: expect.any(Function) })

    expect(accessTokenFactoryCallbackSpy).toHaveBeenCalledWith(USER_TOKEN)

    expect(configureLoggingMocked).toHaveBeenCalledExactlyOnceWith(LogLevel.Information)

    expect(withAutomaticReconnectMocked).toHaveBeenCalledExactlyOnceWith()
  })
})
