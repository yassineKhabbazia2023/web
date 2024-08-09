import { vi, describe, it, expect } from 'vitest'
import { getNewHubConnection } from './DataStreamHubConnectionHelper'
import { LogLevel } from '@microsoft/signalr'

const HUB_URL = 'https://testhuburl.com'
const USER_TOKEN = 'testToken'

interface WithUrlOptions {
  accessTokenFactory: () => string
}

const withUrlMocked = vi.hoisted(() => vi.fn())
const configureLoggingMocked = vi.hoisted(() => vi.fn())
const withAutomaticReconnectMocked = vi.hoisted(() => vi.fn())
const buildMocked = vi.hoisted(() => vi.fn())

const hubConnectionBuilderMocked = {
  withUrl: withUrlMocked,
  configureLogging: configureLoggingMocked,
  withAutomaticReconnect: withAutomaticReconnectMocked,
  build: buildMocked,
}

const HubConnectionBuilderMocked = vi.hoisted(() => vi.fn(() => (hubConnectionBuilderMocked)))

vi.mock('@microsoft/signalr', async () => {
  const signalr = await vi.importActual('@microsoft/signalr') as {}

  return {
    ...signalr,
    HubConnectionBuilder: HubConnectionBuilderMocked,
  }
})

describe('getNewHubConnection', () => {
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

    expect(withUrlMocked).toHaveBeenCalledOnce()
    expect(withUrlMocked).toHaveBeenCalledWith(HUB_URL, { accessTokenFactory: expect.any(Function) })

    expect(accessTokenFactoryCallbackSpy).toHaveBeenCalledWith(USER_TOKEN)

    expect(configureLoggingMocked).toHaveBeenCalledOnce()
    expect(configureLoggingMocked).toHaveBeenCalledWith(LogLevel.Information)

    expect(withAutomaticReconnectMocked).toHaveBeenCalledOnce()
    expect(withAutomaticReconnectMocked).toHaveBeenCalledWith()
  })
})
