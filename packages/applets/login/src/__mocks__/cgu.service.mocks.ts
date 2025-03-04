export const getTermsByCurrentUserMock = vi.fn(() => Promise.resolve({
  isCurrent: true,
  terms: {
    termsId: '123456',
  },
}))
export const updateTermsByCurrentUserMock = vi.fn()
export const getLatestTermsMock = vi.fn(() => Promise.resolve({ data: { termsId: 1 } }))

export const cguServiceMock = {
  getTermsByCurrentUser: getTermsByCurrentUserMock,
  updateTermsByCurrentUser: updateTermsByCurrentUserMock,
  getLatestTerms: getLatestTermsMock,
}
