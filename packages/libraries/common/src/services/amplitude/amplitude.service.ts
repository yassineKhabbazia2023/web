import { SERVER_ZONE } from './constants'
import * as amplitude from '@amplitude/analytics-browser'
import type { BaseEvent } from '@amplitude/analytics-types'
import { logger } from '@pulse/core'

export default class AmplitudeService {
  private static instance: AmplitudeService
  private isInitiated: boolean
  private currentUserId: string
  private userProperty: Record<string, string | number>

  private constructor() {
    this.isInitiated = false
    this.currentUserId = ''
    this.userProperty = {}
  }

  public static getInstance(): AmplitudeService {
    AmplitudeService.instance ??= new AmplitudeService()
    return AmplitudeService.instance
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
      logger.trace('Amplitude - initialized')
    }
  }

  public track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any>,
  ) {
    logger.trace(`Amplitude - track event ${eventInput} for user ${this.currentUserId} with properties`, eventProperties)
    amplitude.track(eventInput, eventProperties)
  }

  public setUserId(userId: string) {
    // we ensure we only set the userId once per user
    if(this.currentUserId !== userId) {
      logger.trace('Amplitude - set current user id', userId)
      amplitude.setUserId(userId)
      this.currentUserId = userId
    }
  }

  public setNewUserProperty(key: string, value: string | number) {
    if(this.userProperty[key] === value) {
      return
    }
    const identifyEvent = new amplitude.Identify()
    identifyEvent.set(key, value)
    logger.trace('Amplitude - set property', key, value)
    amplitude.identify(identifyEvent)
    this.userProperty[key] = value
  }

  public identifyCustomer() {
    this.setNewUserProperty('user_type', 'Client')
  }

  public identifyCollaborator() {
    this.setNewUserProperty('user_type', 'Collaborateur')
  }

  public reset() {
    logger.trace('Amplitude - resetting to clean up user id and origin')
    this.userProperty = {}
    this.currentUserId = ''
    amplitude.reset()
  }
}
