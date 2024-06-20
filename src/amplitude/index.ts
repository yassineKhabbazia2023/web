import * as amplitude from '@amplitude/analytics-browser'
import type { BaseEvent } from '@amplitude/analytics-types'
import { SERVER_ZONE } from './constants'

export class AmplitudeService {
  // eslint-disable-next-line no-use-before-define
  private static instance: AmplitudeService
  private isInitiated: boolean

  private constructor() {
    this.isInitiated = false
  }

  static getInstance(): AmplitudeService {
    if (!AmplitudeService.instance) {
      AmplitudeService.instance = new AmplitudeService()
    }

    return AmplitudeService.instance
  }

  public init(apiKey: string){
    if (!this.isInitiated) {
      amplitude.init(
        apiKey,
        undefined, // the default value of the userId
        {
          serverZone: SERVER_ZONE,
          defaultTracking: false,
          minIdLength: 1,
        }
      )
      this.isInitiated = true
    }
  }

  public track(eventInput: string | BaseEvent, eventProperties?: Record<string, any>) {
    amplitude.track(eventInput, eventProperties)
  }

  public setUserId(userId: number) {
    amplitude.setUserId(userId.toString())
  }

  public reset() {
    amplitude.reset()
  }
}
