import { apiErrorKey, readApiError, readApiStatus } from './api-error.utils'

describe('apiErrorKey', () => {
  it('should word a refusal by the code the caller knows', () => {
    const error = { response: { status: 409, data: { code: 'not-published', title: 'Nothing is published.' } } }

    expect(apiErrorKey(error, 'fallback', { 'not-published': 'notPublished' })).toBe('notPublished')
  })

  it('should fall back on the caller\'s wording, never on the text of the microservice', () => {
    const error = { response: { status: 422, data: { detail: 'Provide the identifier of a theme.', errors: [{ pointer: '/x', detail: 'raw' }] } } }

    expect(apiErrorKey(error, 'fallback')).toBe('fallback')
  })

  it('should word a body too large whatever the caller knows', () => {
    const error = { response: { status: 413, data: { code: 'not-published' } } }

    expect(apiErrorKey(error, 'fallback', { 'not-published': 'notPublished' })).toBe('keyMoments.errors.payloadTooLarge')
  })

  it('should fall back on a failure without a body', () => {
    expect(apiErrorKey(new Error('network'), 'fallback')).toBe('fallback')
    expect(apiErrorKey(null, 'fallback')).toBe('fallback')
  })
})

describe('readApiError', () => {
  it('should read the code, the status and the pointers of a refusal', () => {
    const error = {
      response: {
        status: 422,
        data: {
          code: 'unknown-citations',
          title: 'Unknown indicator citations',
          errors: [{ pointer: '/screens/0/widgets/2/lines/1/indicator', detail: 'inconnu' }],
        },
      },
    }

    expect(readApiError(error)).toEqual({
      status: 422,
      code: 'unknown-citations',
      title: 'Unknown indicator citations',
      detail: undefined,
      entries: [{ pointer: '/screens/0/widgets/2/lines/1/indicator', detail: 'inconnu' }],
    })
  })

  it('should read a conflict carrying no pointer at all', () => {
    expect(readApiError({ response: { status: 409, data: { title: 'Template: state conflict' } } }))
      .toEqual({ status: 409, code: undefined, title: 'Template: state conflict', detail: undefined, entries: [] })
  })

  it('should give nothing on a failure without a body', () => {
    expect(readApiError(new Error('network'))).toBeUndefined()
    expect(readApiError(null)).toBeUndefined()
  })
})

describe('readApiStatus', () => {
  it('should read the status of a refusal carrying no body', () => {
    expect(readApiStatus({ response: { status: 409 } })).toBe(409)
  })

  it('should give nothing on anything that is not a response', () => {
    expect(readApiStatus(new Error('network'))).toBeUndefined()
    expect(readApiStatus(null)).toBeUndefined()
  })
})
