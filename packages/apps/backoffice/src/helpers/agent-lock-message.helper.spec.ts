import { getPlainTextFromAgentLockMessage } from './agent-lock-message.helper'

describe('agent-lock-message.helper', () => {
  it('should convert agent lock HTML message to plain text', () => {
    expect(getPlainTextFromAgentLockMessage(
      '<b>VERROUILLAGE APPLIQUÉ</b><br><br>L\'environnement <b>ITG</b> est verrouillé.',
    )).toBe('VERROUILLAGE APPLIQUÉ\n\nL\'environnement ITG est verrouillé.')
  })
})
