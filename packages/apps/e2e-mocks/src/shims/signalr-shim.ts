// Shim for @microsoft/signalr in E2E mode
// Provides a mock HubConnection that doesn't actually connect

class MockHubConnection {
  private readonly handlers: Map<string, ((...args: unknown[]) => void)[]> = new Map()

  start(): Promise<void> {
    return Promise.resolve()
  }

  stop(): Promise<void> {
    return Promise.resolve()
  }

  invoke(_methodName: string, ..._args: unknown[]): Promise<void> {
    return Promise.resolve()
  }

  on(methodName: string, handler: (...args: unknown[]) => void): void {
    if (!this.handlers.has(methodName)) {
      this.handlers.set(methodName, [])
    }
    this.handlers.get(methodName)?.push(handler)
  }

  off(methodName: string, handler?: (...args: unknown[]) => void): void {
    if (handler) {
      const handlers = this.handlers.get(methodName)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index !== -1) {
          handlers.splice(index, 1)
        }
      }
    } else {
      this.handlers.delete(methodName)
    }
  }

  onclose(_callback: (error?: Error) => void): void {
    // No-op
  }

  onreconnecting(_callback: (error?: Error) => void): void {
    // No-op
  }

  onreconnected(_callback: (connectionId?: string) => void): void {
    // No-op
  }
}

class MockHubConnectionBuilder {
  withUrl(_url: string, _options?: unknown) {
    return this
  }

  withAutomaticReconnect(_retryDelays?: number[]) {
    return this
  }

  configureLogging(_logLevel: unknown) {
    return this
  }

  build(): MockHubConnection {
    return new MockHubConnection()
  }
}

export const HubConnectionBuilder = MockHubConnectionBuilder
export const HubConnectionState = {
  Disconnected: 'Disconnected',
  Connecting: 'Connecting',
  Connected: 'Connected',
  Disconnecting: 'Disconnecting',
  Reconnecting: 'Reconnecting',
}
export const LogLevel = {
  Trace: 0,
  Debug: 1,
  Information: 2,
  Warning: 3,
  Error: 4,
  Critical: 5,
  None: 6,
}

export type HubConnection = MockHubConnection
