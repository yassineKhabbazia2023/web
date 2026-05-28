// Shim for @amplitude/analytics-browser in E2E mode
// Records tracked events into globalThis.__AMPLITUDE_EVENTS__ for test assertions

export interface AmplitudeEvent {
  event_type: string
  event_properties?: Record<string, unknown>
}

declare global {
  var __AMPLITUDE_EVENTS__: AmplitudeEvent[]
}

function getEvents(): AmplitudeEvent[] {
  globalThis.__AMPLITUDE_EVENTS__ ??= []
  return globalThis.__AMPLITUDE_EVENTS__
}

export function init() {
  getEvents()
}

export function track(
  eventInput: string | { event_type: string },
  eventProperties?: Record<string, unknown>,
) {
  const eventType = typeof eventInput === 'string' ? eventInput : eventInput.event_type
  getEvents().push({
    event_type: eventType,
    event_properties: eventProperties,
  })
}

export function setUserId(_userId?: string) {
  // No-op
}

export function identify(_identifyEvent: unknown) {
  // No-op
}

export function reset() {
  // No-op
}

export function add(_plugin: unknown) {
  // No-op
}

export class Identify {
  set(_key: string, _value: unknown): this {
    return this
  }
}
