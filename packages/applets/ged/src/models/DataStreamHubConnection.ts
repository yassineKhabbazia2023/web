import { logger } from '@pulse/toolbox'
import type { HubConnection } from '@microsoft/signalr'
import { useTokenStore } from '@pulse/common/stores'
import { getNewHubConnection } from './DataStreamHubConnectionHelper'

/*
As we have a hub URL for each domain, this class is meant to be extended.
That way, we can have a NotificationHubConnection for each domain.
e.g: class MyDomainHubConnection extends HubConnection ...

To subscribe to any event use the .invoke method from HubConnection
To register an event handler use the .on method from HubConnection
https://learn.microsoft.com/en-us/javascript/api/@microsoft/signalr/hubconnection?view=signalr-js-latest#methods
*/
export class DataStreamHubConnection {
  private readonly connection: HubConnection
  private readonly hubUrl: string
  private isConnected = false
  private readonly userToken = useTokenStore().getToken()

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl
    this.connection = getNewHubConnection(this.hubUrl, this.userToken)
  }

  public async startConnection() {
    return await this.connection
      .start()
      .then(() => {
        this.setIsConnected(true)
      })
      .catch((error) => {
        logger.error(`Hub connection to ${this.hubUrl} failed`, error)
      })
  }

  public getConnection() {
    return this.connection
  }

  public async destroyConnection() {
    // Destroying the hub automatically removes every listener
    if (this.getIsConnected() === false) {
      return
    }

    await this.connection
      .stop()
      .then(() => {
        this.setIsConnected(false)
      })
      .catch((error) => {
        logger.error(error)
      })
  }

  public getIsConnected() {
    return this.isConnected
  }

  private setIsConnected(value: boolean) {
    this.isConnected = value
  }
}
