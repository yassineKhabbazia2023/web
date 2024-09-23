
import { vi } from 'vitest'

export enum LogLevel {
  // eslint-disable-next-line no-unused-vars
  Information = 2
}

export interface ILogger {
  // eslint-disable-next-line no-unused-vars
  log(logLevel: LogLevel, message: string): void
}

class HubConnection {
  public on = vi.fn()

  public start = vi.fn().mockRejectedValue(undefined)

  public stop = vi.fn().mockResolvedValue(undefined)

  public invoke = vi
    .fn()
    .mockImplementation((_methodName: string, _callback: () => string) => {
      return Promise.resolve()
    })
}

export class HubConnectionBuilder {
  public withUrl = vi.fn().mockImplementation((_url: string, _options: any) => {
    return this
  })

  public configureLogging = vi
    .fn()
    .mockImplementation((_logging: LogLevel | string | ILogger) => {
      return this
    })

  public withAutomaticReconnect = vi.fn().mockImplementation(() => {
    return this
  })

  public build = vi.fn().mockImplementation(() => {
    return new HubConnection()
  })
}
