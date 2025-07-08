import { SERVER_ZONE } from './constants'
import * as amplitude from '@amplitude/analytics-browser'
import type { BaseEvent } from '@amplitude/analytics-types'
import { logger } from '@pulse/core'
import { ContactType } from '@pulse/common/enums'

/**
 * Service for managing Amplitude analytics integration
 * Provides methods to initialize, track events, and manage user properties
 */
export class AmplitudeService {
  private static initialized = false
  private static currentUserId: string = ''
  private static userProperty: Record<string, any> = {}

  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * Check if the service is initialized
   * @returns true if initialized, false otherwise
   */
  private static isInitialized(): boolean {
    // Check if the service is initialized
    // Silent failure if not initialized (otherwise the .track will spam the console)
    return AmplitudeService.initialized
  }

  /**
   * Initialize the Amplitude service with API key and optional server proxy URL
   * @param apiKey - The Amplitude API key
   * @param serverUrl - Optional server proxy URL for data collection
   */
  static init(apiKey: string, serverUrl?: string) {
    if (AmplitudeService.isInitialized()) {
      logger.trace('Amplitude - already initialized, skipping init call')
      return
    }

    if (!apiKey || apiKey.trim() === '') {
      logger.error('Amplitude - API key is required for initialization')
      return
    }

    AmplitudeService.initialized = true
    amplitude.init(
      apiKey,
      undefined, // the default value of the userId
      {
        serverZone: SERVER_ZONE,
        defaultTracking: false,
        minIdLength: 1,
        serverUrl: serverUrl || undefined,
      },
    )
    logger.trace('Amplitude - initialized')
  }

  /**
   * Track an event with optional properties
   * @param eventInput - Event name or BaseEvent object
   * @param eventProperties - Optional properties to associate with the event
   */
  static track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any>,
  ) {
    if (AmplitudeService.isInitialized() === false) {
      return
    }

    try {
      const eventName = typeof eventInput === 'string' ? eventInput : eventInput.event_type
      logger.trace(`Amplitude - track event "${eventName}" for user ${AmplitudeService.currentUserId} with properties`, eventProperties)
      amplitude.track(eventInput, eventProperties)
    } catch (error) {
      logger.warn('Amplitude - failed to track event:', error)
    }
  }

  /**
   * Set the user ID for Amplitude
   * @param userId - The user ID to set
   */
  static setUserId(userId: string) {
    if (AmplitudeService.isInitialized() === false) {
      return
    }

    try {
      // we ensure we only set the userId once per user
      if(AmplitudeService.currentUserId !== userId) {
        logger.trace('Amplitude - set current user id', userId)
        amplitude.setUserId(userId)
        AmplitudeService.currentUserId = userId
      }
    } catch (error) {
      logger.warn('Amplitude - failed to set user id:', error)
    }
  }

  private static setNewUserProperty(key: string, value: string | number) {
    if(AmplitudeService.userProperty[key] === value) {
      return
    }
    try {
      const identifyEvent = new amplitude.Identify()
      identifyEvent.set(key, value)
      logger.trace('Amplitude - set property', key, value)
      amplitude.identify(identifyEvent)
      AmplitudeService.userProperty[key] = value
    } catch (error) {
      logger.warn('Amplitude - failed to set user property:', error)
    }
  }

  static identifyCustomer() {
    if (AmplitudeService.isInitialized() === false) {
      return
    }
    AmplitudeService.setNewUserProperty('user_type', ContactType.CUSTOMER)
  }

  static identifyCollaborator() {
    if (AmplitudeService.isInitialized() === false) {
      return
    }
    AmplitudeService.setNewUserProperty('user_type', ContactType.COLLABORATOR)
  }

  /**
   * Reset the Amplitude service of all user identification properties
   * Doesn't reset the init part
   */
  static reset() {
    if (AmplitudeService.isInitialized() === false) {
      return
    }
    try {
      logger.trace('Amplitude - resetting to clean up user id and origin')
      AmplitudeService.userProperty = {}
      AmplitudeService.currentUserId = ''
      amplitude.reset()
    } catch (error) {
      logger.warn('Amplitude - failed to reset:', error)
    }
  }
}
