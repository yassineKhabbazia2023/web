import { mostRecentDeliveredVariant } from './comment.utils'
import type { CommentVariant } from '../types/key-moments.types'

/** A slot read by two imports and one contributor, in the order the tabs read. */
const VARIANTS: CommentVariant[] = [
  {
    key: 'closing:1',
    contributorId: null,
    closingVersion: 1,
    label: 'Version 1',
    tabLabel: 'Version 1',
    text: 'Texte de la v1.',
    isMine: false,
  },
  {
    key: 'closing:3',
    contributorId: null,
    closingVersion: 3,
    label: 'Version 3',
    tabLabel: 'Version 3',
    text: 'Texte de la v3.',
    isMine: false,
  },
  {
    key: '123',
    contributorId: '123',
    label: 'John Doe',
    tabLabel: 'JD',
    text: 'Ma lecture.',
    isMine: true,
  },
]

describe('key-moments comment variants', () => {

  /** The tabs read oldest first: the most recent delivery is the last of them. */
  it('should read the most recent delivery, never the first tab', () => {
    expect(mostRecentDeliveredVariant(VARIANTS)?.key).toBe('closing:3')
  })

  it('should ignore the contributions', () => {
    expect(mostRecentDeliveredVariant([VARIANTS[2]])).toBeUndefined()
  })

  it('should read nothing on a slot without any variant', () => {
    expect(mostRecentDeliveredVariant([])).toBeUndefined()
  })
})
