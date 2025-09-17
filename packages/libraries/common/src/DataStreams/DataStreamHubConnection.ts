import { logger } from '@pulse/core'
import type { HubConnection } from '@microsoft/signalr'
import { getNewHubConnection } from './DataStreamHubConnectionHelper'
import { useTokenStore } from '../stores/token/token.store'

/* As we have a hub URL for each domain, this class is meant to be extended.
That way, we can have a NotificationHubConnection for each domain.
e.g: class MyDomainHubConnection extends HubConnection ...

To subscribe to an any event use the .invoke method from HubConnection
To register an event handler use the .on method from HubConnection
https://learn.microsoft.com/en-us/javascript/api/@microsoft/signalr/hubconnection?view=signalr-js-latest#methods */

export class DataStreamHubConnection {
  private readonly connection: HubConnection
  private readonly hubUrl: string
  private isConnected: boolean
  private readonly userToken: string

  constructor(hubUrl: string) {
    this.isConnected = false
    this.hubUrl = hubUrl
    const tokenStore = useTokenStore()
    this.userToken = tokenStore.getToken()
    this.connection = getNewHubConnection(this.hubUrl, this.userToken)
  }

  public async startConnection() {
    return await this.connection
      .start()
      .then(() => {
        this.setIsConnected(true)
      })
      .catch((err) =>
        logger.error(`Hub connection to ${this.hubUrl} failed`, err),
      )
  }

  public getConnection() {
    return this.connection
  }

  public async destroyConnection() {
    // Destroying the hub automatically removes every listener
    if (!this.getIsConnected()) {
      return
    }
    await this.connection
      .stop()
      .then(() => {
        this.setIsConnected(false)
      })
      .catch((error) => logger.error(error))
  }

  public getIsConnected() {
    return this.isConnected
  }

  private setIsConnected(value: boolean) {
    this.isConnected = value
  }
}
