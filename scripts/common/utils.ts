import { rmSync, existsSync, mkdirSync } from 'fs'
import { type Config } from 'svgo'

export function clearFolder(outputPath: string) {
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
  mkdirSync(outputPath)
}

export function getSvgoConfig(): Config {
  const pluginPresetDefault = {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
        inlineStyles: {
          onlyMatchedOnce: false
        }
      }
    }
  }
  const plugins = [
    'removeDimensions',
    'removeXMLNS',
    pluginPresetDefault
  ]

  return {
    plugins
  } as Config
}
