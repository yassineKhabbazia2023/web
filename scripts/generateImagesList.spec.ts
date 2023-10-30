import { describe, expect, it, vi } from 'vitest'
import writeJSONFileImagesList from './generateImagesList'

vi.mock('fs', () => ({
  readdirSync: () => ['folder1', 'folder2', 'folder3'],
  statSync: () => ({
    isDirectory: () => true
  }),
  writeFileSync: (path: string, content, encoding) => ({ path, content, encoding })
}))

describe('writeJSONFileImagesList', () => {
  it('creates a json file with folders and images files', () => {
    expect(writeJSONFileImagesList()).toStrictEqual({
      content: expect.any(String),
      encoding: 'utf8',
      path: expect.any(String)
    })
  })
})
