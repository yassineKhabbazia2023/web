import { readApiError, readApiErrorDetail, readApiStatus } from './api-error.utils'

describe('readApiErrorDetail', () => {
  it('should read the detail of a validation error', () => {
    const error = { response: { status: 422, data: { detail: 'Composant inconnu : foo' } } }

    expect(readApiErrorDetail(error)).toBe('Composant inconnu : foo')
  })

  it('should join the errors of a validation report', () => {
    const error = {
      response: {
        status: 422,
        data: {
          errors: [
            { pointer: '/components/0', detail: 'inconnu' },
            { pointer: '', detail: 'cycle' },
          ],
        },
      },
    }

    expect(readApiErrorDetail(error)).toBe('/components/0 — inconnu\ncycle')
  })

  it('should read the title of a conflict', () => {
    expect(readApiErrorDetail({ response: { status: 409, data: { title: 'Code déjà utilisé' } } }))
      .toBe('Code déjà utilisé')
  })

  it('should give nothing on a failure without a body', () => {
    expect(readApiErrorDetail(new Error('network'))).toBeUndefined()
    expect(readApiErrorDetail(null)).toBeUndefined()
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
