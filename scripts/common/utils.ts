import { rmSync, existsSync, mkdirSync } from 'fs'

export function clearFolder(outputPath: string) {
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
  mkdirSync(outputPath)
}
