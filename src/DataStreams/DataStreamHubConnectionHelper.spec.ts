import { describe, it, expect } from 'vitest'
import { getNewHubConnection } from './DataStreamHubConnectionHelper' // Remplacez avec le chemin d'accès correct
import { HubConnection } from '@microsoft/signalr'

const HUB_URL = 'https://testhuburl.com'
const USER_TOKEN = 'testToken'
describe('getNewHubConnection', () => {

  it('returns a HubConnection instance', () => {
    const connection = getNewHubConnection(HUB_URL, USER_TOKEN)
    expect(connection).toBeInstanceOf(HubConnection)
  })
})
