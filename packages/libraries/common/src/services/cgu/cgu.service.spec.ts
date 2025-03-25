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

const apiGatewayGetMock = vi.hoisted(() => vi.fn())
const apiGatewayPatchMock = vi.hoisted(() => vi.fn())
vi.mock('../../api', () => ({
  default: () => ({
    gateway: {
      get: apiGatewayGetMock,
      patch: apiGatewayPatchMock,
    },
  }),
}))

describe('getTermsByCurrentUser', () => {
  it('should return cgu accepted by user', async () => {
    const expectedUrl = 'contact/api/contacts/currentuser/terms'
    apiGatewayGetMock.mockResolvedValueOnce({
      data: cguMock,
    })
    const data = await getTermsByCurrentUser()

    expect(apiGatewayGetMock).toHaveBeenCalledOnce()
    expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
    expect(data).toStrictEqual(cguMock)
  })
})

describe('getLatestTerms', () => {
  it('should return latest terms active', async () => {
    const expectedUrl = 'contact/api/terms/latest'
    apiGatewayGetMock.mockResolvedValueOnce({
      data: termsMock,
    })
    const data = await getLatestTerms()

    expect(apiGatewayGetMock).toHaveBeenCalledOnce()
    expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
    expect(data).toStrictEqual(termsMock)
  })
})

describe('updateTermsByCurrentUser', () => {
  it('should return a message note', async () => {
    const expectedUrl = 'contact/api/contacts/currentuser/terms?termsId=123311'
    apiGatewayPatchMock.mockResolvedValueOnce({
      data: cguMessageDone,
    })
    const { data } = await updateTermsByCurrentUser(123311)

    expect(apiGatewayPatchMock).toHaveBeenCalledOnce()
    expect(apiGatewayPatchMock).toHaveBeenNthCalledWith(1, expectedUrl)
    expect(data).toStrictEqual(cguMessageDone)
  })
})
