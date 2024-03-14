/* eslint-disable vitest/no-hooks */
import { it, expect, vi, describe, beforeEach } from 'vitest'
import { downloadFile } from './downloadFilesHelper'

describe('downloadFile', () => {
  beforeEach(() => {
    vi.spyOn(window.URL, 'createObjectURL').mockImplementation(
      () => 'http://fake.url',
    )
  })

  it('should create a download link and click on it', () => {
    const data:any = '12345'
    const fileName = 'test.txt'
    vi.spyOn(window.document.body, 'appendChild')
    downloadFile(data, fileName)

    expect(URL.createObjectURL).toHaveBeenCalledWithExactlyOnceWith(new Blob([data]))
    expect(window.document.body.appendChild).toHaveBeenCalledWithExactlyOnceWith(
      expect.any(HTMLAnchorElement),
    )
  })
})
