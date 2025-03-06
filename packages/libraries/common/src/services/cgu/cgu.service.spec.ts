import { describe, it, expect, vi } from 'vitest'
import {
  getTermsByCurrentUser,
  updateTermsByCurrentUser,
  getLatestTerms,
} from './cgu.service'

const cguMock = {
  isCurrent: true,
  terms: {
    termsId: 123456,
  },
}

const termsMock = {
  termsId: 123456,
  uploadDate: '2024-06-19T14:37:18',
}

const cguMessageDone = { message: 'Done !' }

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn((url) => {
          if (url.includes('contacts/currentuser')) {
            return Promise.resolve({ data: cguMock })
          }
          return Promise.resolve({ data: termsMock })
        }),
        patch: vi.fn(() => Promise.resolve({ data: cguMessageDone })),
      },
    }),
  }
})

describe('getTermsByCurrentUser', () => {
  it('should return cgu accepted by user', async () => {
    const data = await getTermsByCurrentUser()
    expect(data).toStrictEqual(cguMock)
  })
})

describe('getLatestTerms', () => {
  it('should return latest terms active', async () => {
    const data = await getLatestTerms()
    expect(data).toStrictEqual(termsMock)
  })
})

describe('updateTermsByCurrentUser', () => {
  it('should return a message note', async () => {
    const response = await updateTermsByCurrentUser(123311)
    expect(response.data).toStrictEqual(cguMessageDone)
  })
})
