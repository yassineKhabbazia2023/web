import { removeFalsyValues } from './object.utils'

describe('test object.utils', () => {
  describe('removeFalsyValues', () => {
    it('remove falsy value in object', () => {
      const OBJECT_WITH_FALSY_VALUES = {
        a: undefined,
        b: 'b',
        c: false,
        d: null,
        e: '',
        f: 0,
      }
      expect(removeFalsyValues(OBJECT_WITH_FALSY_VALUES)).toStrictEqual({ b: 'b' })
    })
  })
})
