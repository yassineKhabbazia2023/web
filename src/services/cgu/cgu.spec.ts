import { describe, it, expect, vi } from 'vitest'
import {
  getTermsByContactId,
  updateTermsByContactId,
} from '.'

const cguMock = {
  isCurrent: true,
  terms: {
    termsId: 123456,
  },
}

const cguMessageDone = { message: 'Done !' }

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn(() => Promise.resolve({ data: cguMock })),
        patch: vi.fn(() => Promise.resolve({ data: cguMessageDone })),
      },
    }),
  }
})

describe('getTermsByContactId', () => {
  it('should return cgu accepted by user', async () => {
    const data = await getTermsByContactId(123456)
    expect(data).toStrictEqual(cguMock)
  })
})

describe('updateTermsByContactId', () => {
  it('should return a message note', async () => {
    const response = await updateTermsByContactId(123311, 23323)
    expect(response.data).toStrictEqual(cguMessageDone)
  })
})

