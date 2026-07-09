import fs from 'node:fs'
import path from 'node:path'
import { pathToFolder } from './match.ts'
import type { MockSummary, RecordedMock } from '../types/proxy.type.ts'

/**
 * Returns the absolute file path where a mock with the given hash for the given URL path is stored.
 */
export function mockFilePath(rootDir: string, urlPath: string, method: string, hash: string): string {
  return path.join(rootDir, pathToFolder(urlPath), `${method.toUpperCase()}.${hash}.json`)
}

/**
 * Loads a previously recorded mock from disk; returns null when no file exists for the given hash.
 */
export function loadMock(rootDir: string, urlPath: string, method: string, hash: string): RecordedMock | null {
  const file = mockFilePath(rootDir, urlPath, method, hash)
  if (fs.existsSync(file) === false) {
    return null
  }
  try {
    const text = fs.readFileSync(file, 'utf-8')
    return JSON.parse(text) as RecordedMock
  } catch {
    return null
  }
}

/**
 * Persists a recorded mock to disk, creating intermediate folders as needed. Overwrites any
 * existing file with the same hash.
 */
export function saveMock(rootDir: string, urlPath: string, mock: RecordedMock): string {
  const file = mockFilePath(rootDir, urlPath, mock.request.method, mock.hash)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(mock, null, 2), 'utf-8')
  return file
}

/**
 * Deletes a recorded mock from disk. Returns true when a file was actually removed.
 */
export function deleteMock(rootDir: string, urlPath: string, method: string, hash: string): boolean {
  const file = mockFilePath(rootDir, urlPath, method, hash)
  if (fs.existsSync(file) === false) {
    return false
  }
  fs.unlinkSync(file)
  return true
}

/**
 * Walks the recorded directory and returns a flat list of mock summaries.
 * Returns an empty array if the directory does not exist yet.
 */
export function listMocks(rootDir: string): MockSummary[] {
  if (fs.existsSync(rootDir) === false) {
    return []
  }
  const results: MockSummary[] = []
  walk(rootDir, (file) => {
    if (file.endsWith('.json') === false) {
      return
    }
    try {
      const mock = JSON.parse(fs.readFileSync(file, 'utf-8')) as RecordedMock
      results.push({
        hash: mock.hash,
        method: mock.request.method,
        path: mock.request.path,
        recordedAt: mock.recordedAt,
        status: mock.response.status,
        file: path.relative(rootDir, file).replaceAll('\\', '/'),
      })
    } catch {
      // Skip unreadable files
    }
  })
  return results.sort((a, b) => a.path.localeCompare(b.path))
}

function walk(dir: string, visit: (file: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, visit)
    } else if (entry.isFile()) {
      visit(full)
    }
  }
}
