import type { HubConnection } from '@microsoft/signalr'
import { storeToRefs } from 'pinia'
import commonStore from '../stores'
import { getNewHubConnection } from './DataStreamHubConnectionHelper'

/* As we have a hub URL for each domain, this class is meant to be extended.
That way, we can have a NotificationHubConnection for each domain.
e.g: class MyDomainHubConnection extends HubConnection ...

To subscribe to an any event use the .invoke method from HubConnection
To register an event handler use the .on method from HubConnection
https://learn.microsoft.com/en-us/javascript/api/@microsoft/signalr/hubconnection?view=signalr-js-latest#methods */

export class DataStreamHubConnection {
  /* private // TO CHECK: monorepo build issue, quick fix */ connection: HubConnection
  /* private // TO CHECK: monorepo build issue, quick fix */ hubUrl: string
  /* private // TO CHECK: monorepo build issue, quick fix */ isConnected: boolean
  /* private // TO CHECK: monorepo build issue, quick fix */ userToken: string

  constructor(hubUrl: string) {
    this.isConnected = false
    this.hubUrl = hubUrl
    this.userToken = storeToRefs(commonStore()).token.value
    this.connection = getNewHubConnection(this.hubUrl, this.userToken)
  }

  public async startConnection() {
    return await this.connection
      .start()
      .then(() => {
        this.setIsConnected(true)
      })
      .catch((err) =>
        console.error(`Hub connection to ${this.hubUrl} failed`, err),
      )
  }

  public getConnection() {
    return this.connection
  }

  public async destroyConnection() {
    // Destroying the hub automatically removes every listener
    if (!this.getIsConnected()) return
    await this.connection
      .stop()
      .then(() => {
        this.setIsConnected(false)
      })
      .catch((error) => console.error(error))
  }

  public getIsConnected() {
    return this.isConnected
  }

  /* private // TO CHECK: monorepo build issue, quick fix */ setIsConnected(value: boolean) {
    this.isConnected = value
  }
}
