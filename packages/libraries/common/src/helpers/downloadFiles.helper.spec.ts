import { downloadFile } from './downloadFiles.helper'

const createObjectURLMock = vi.hoisted(() => vi.fn())
const revokeObjectURLMock = vi.hoisted(() => vi.fn())

describe('downloadFile', () => {
  it('should create a download link and click on it', () => {
    const url = 'https://fakeUrl'
    const data:any = '12345'
    const fileName = 'test.txt'
    const appendChildSpy = vi.spyOn(window.document.body, 'appendChild')

    const expectedArgument = document.createElement('a')

    expectedArgument.target = '_blank'
    expectedArgument.href = url
    expectedArgument.download = fileName
    expectedArgument.type = 'application/octet-stream'

    createObjectURLMock.mockImplementation((_: Blob | MediaSource) => url)
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock

    downloadFile(data, fileName)

    expect(createObjectURLMock).toHaveBeenCalledWith(new Blob([data]))
    expect(window.document.body.appendChild).toHaveBeenCalledWith(
      expect.any(HTMLAnchorElement),
    )
    expect(appendChildSpy).toHaveBeenCalledWith(expectedArgument)
  })

  it('should clean up the link and revoke the object URL after the download', () => {
    const url = 'https://fakeUrl'
    createObjectURLMock.mockImplementation((_: Blob | MediaSource) => url)
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove')

    downloadFile('12345', 'test.txt')

    expect(removeSpy).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalledWith(url)
  })
})
