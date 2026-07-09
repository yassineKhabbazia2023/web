import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { deleteMock, listMocks, loadMock, mockFilePath, saveMock } from './storage'
import type { RecordedMock } from '../types/proxy.type'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proxy-storage-'))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

function buildMock(overrides: Partial<RecordedMock> = {}): RecordedMock {
  return {
    hash: 'abc123def4567890',
    recordedAt: '2026-01-01T00:00:00.000Z',
    request: {
      method: 'GET',
      path: '/api/users/602',
      query: {},
      headers: {},
      body: { encoding: 'empty', data: null },
    },
    response: {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: { encoding: 'json', data: { id: 602 } },
    },
    ...overrides,
  }
}

describe('mockFilePath', () => {
  it('builds a deterministic path from URL path, method and hash', () => {
    const file = mockFilePath(tmpDir, '/api/users/602', 'get', 'abc123')
    expect(file).toBe(path.join(tmpDir, 'api', 'users', '602', 'GET.abc123.json'))
  })
})

describe('saveMock + loadMock', () => {
  it('round-trips a recorded mock through disk', () => {
    const mock = buildMock()
    saveMock(tmpDir, mock.request.path, mock)
    const loaded = loadMock(tmpDir, mock.request.path, mock.request.method, mock.hash)
    expect(loaded).toEqual(mock)
  })

  it('returns null when the mock file does not exist', () => {
    expect(loadMock(tmpDir, '/missing', 'GET', 'deadbeef')).toBeNull()
  })
})

describe('deleteMock', () => {
  it('removes the mock file and returns true', () => {
    const mock = buildMock()
    saveMock(tmpDir, mock.request.path, mock)
    expect(deleteMock(tmpDir, mock.request.path, mock.request.method, mock.hash)).toBe(true)
    expect(loadMock(tmpDir, mock.request.path, mock.request.method, mock.hash)).toBeNull()
  })

  it('returns false when the file does not exist', () => {
    expect(deleteMock(tmpDir, '/nope', 'GET', 'x')).toBe(false)
  })
})

describe('listMocks', () => {
  it('returns an empty array when the directory does not exist', () => {
    expect(listMocks(path.join(tmpDir, 'missing'))).toEqual([])
  })

  it('returns a summary for every saved mock', () => {
    saveMock(tmpDir, '/api/a', buildMock({ hash: 'h1', request: { ...buildMock().request, path: '/api/a' } }))
    saveMock(tmpDir, '/api/b', buildMock({ hash: 'h2', request: { ...buildMock().request, path: '/api/b' } }))
    const summaries = listMocks(tmpDir)
    expect(summaries).toHaveLength(2)
    expect(summaries.map((s) => s.path)).toEqual(['/api/a', '/api/b'])
  })
})
