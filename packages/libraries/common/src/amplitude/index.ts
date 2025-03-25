import { SERVER_ZONE } from './constants'
import * as amplitude from '@amplitude/analytics-browser'
import type { BaseEvent } from '@amplitude/analytics-types'

export default class AmplitudeService {
  private isInitiated: boolean
  private currentUserId: string

  constructor() {
    this.isInitiated = false
    this.currentUserId = ''
  }

  public init(apiKey: string, serverUrl?: string) {
    if (!this.isInitiated) {
      amplitude.init(
        apiKey,
        undefined, // the default value of the userId
        {
          serverZone: SERVER_ZONE,
          defaultTracking: false,
          minIdLength: 1,
          serverUrl,
        },
      )
      this.isInitiated = true
    }
  }

  public track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any>,
  ) {
    amplitude.track(eventInput, eventProperties)
  }

  public setUserId(userId: string) {
    // we ensure we only set the userId once per user
    if(this.currentUserId !== userId) {
      this.currentUserId = userId
      amplitude.setUserId(userId)
    }
  }

  public setNewUserProperty(key: string, value: string | number) {
    const identifyEvent = new amplitude.Identify()
    identifyEvent.set(key, value)
    amplitude.identify(identifyEvent)
  }

  public reset() {
    amplitude.reset()
  }
}
