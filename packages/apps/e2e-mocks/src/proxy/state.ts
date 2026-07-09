import fs from 'node:fs'
import path from 'node:path'
import type { ProxyMode } from '../types/proxy.type.ts'

const VALID_MODES: ReadonlySet<ProxyMode> = new Set(['passthrough', 'mock', 'hybrid'])

/**
 * Returns true when the given value is one of the three supported proxy modes.
 */
export function isProxyMode(value: unknown): value is ProxyMode {
  return typeof value === 'string' && VALID_MODES.has(value as ProxyMode)
}

/**
 * In-memory + on-disk state holder for the current proxy mode.
 * The persisted file makes the mode survive dev-server restarts.
 */
export class ProxyState {
  private currentMode: ProxyMode
  private readonly persistFile: string

  constructor(rootDir: string, defaultMode: ProxyMode) {
    this.persistFile = path.join(rootDir, '.proxy-mode.json')
    this.currentMode = this.readPersistedMode() ?? defaultMode
  }

  getMode(): ProxyMode {
    return this.currentMode
  }

  setMode(mode: ProxyMode): void {
    this.currentMode = mode
    this.persistMode(mode)
  }

  private readPersistedMode(): ProxyMode | null {
    if (fs.existsSync(this.persistFile) === false) {
      return null
    }
    try {
      const raw = JSON.parse(fs.readFileSync(this.persistFile, 'utf-8')) as { mode?: unknown }
      if (isProxyMode(raw.mode)) {
        return raw.mode
      }
      return null
    } catch {
      return null
    }
  }

  private persistMode(mode: ProxyMode): void {
    try {
      fs.mkdirSync(path.dirname(this.persistFile), { recursive: true })
      fs.writeFileSync(this.persistFile, JSON.stringify({ mode }, null, 2), 'utf-8')
    } catch {
      // Persistence is best-effort; ignore filesystem errors
    }
  }
}
