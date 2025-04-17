import { Idle } from 'idlejs'

export function setIdle(withinMinutes: number, callback: () => void) {
  new Idle()
    .whenNotInteractive()
    .within(withinMinutes)
    .do(callback)
    .start()
}
