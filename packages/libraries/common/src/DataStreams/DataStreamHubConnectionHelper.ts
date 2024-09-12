import {
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr'

export function getNewHubConnection(hubUrl: string, userToken: string) {
  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => userToken,
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build()
}
