import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isProxyMode, ProxyState } from './state'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proxy-state-'))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('isProxyMode', () => {
  it('returns true for the three supported modes', () => {
    expect(isProxyMode('passthrough')).toBe(true)
    expect(isProxyMode('mock')).toBe(true)
    expect(isProxyMode('hybrid')).toBe(true)
  })

  it('returns false for unknown values', () => {
    expect(isProxyMode('record')).toBe(false)
    expect(isProxyMode('')).toBe(false)
    expect(isProxyMode(undefined)).toBe(false)
    expect(isProxyMode(42)).toBe(false)
  })
})

describe('ProxyState', () => {
  it('falls back to the provided default when no persisted file exists', () => {
    const state = new ProxyState(tmpDir, 'hybrid')
    expect(state.getMode()).toBe('hybrid')
  })

  it('persists the mode so a new instance reads it back', () => {
    const state = new ProxyState(tmpDir, 'hybrid')
    state.setMode('mock')

    const reloaded = new ProxyState(tmpDir, 'passthrough')
    expect(reloaded.getMode()).toBe('mock')
  })

  it('ignores a persisted file containing an invalid mode', () => {
    fs.writeFileSync(path.join(tmpDir, '.proxy-mode.json'), JSON.stringify({ mode: 'invalid' }), 'utf-8')
    const state = new ProxyState(tmpDir, 'passthrough')
    expect(state.getMode()).toBe('passthrough')
  })

  it('ignores a persisted file containing invalid JSON', () => {
    fs.writeFileSync(path.join(tmpDir, '.proxy-mode.json'), 'not-json', 'utf-8')
    const state = new ProxyState(tmpDir, 'hybrid')
    expect(state.getMode()).toBe('hybrid')
  })
})
