import * as amplitude from '@amplitude/analytics-browser'
import type { BaseEvent } from '@amplitude/analytics-types'
import { DEFAULT_TRACKING, SERVER_ZONE } from './constants'

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
      amplitude.init(apiKey, {
        serverZone: SERVER_ZONE,
        defaultTracking: DEFAULT_TRACKING
      })
      this.isInitiated = true
    }
  }

  public track(options: string | BaseEvent, eventTracking?: BaseEvent) {
    amplitude.track(options, eventTracking)
  }

  public setUserId(userId: string) {
    amplitude.setUserId(userId)
  }
}
