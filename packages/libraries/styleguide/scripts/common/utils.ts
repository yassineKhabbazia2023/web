import { rmSync, existsSync, mkdirSync } from 'fs'
import { type Config } from 'svgo'

export function clearFolder(outputPath: string) {
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
  mkdirSync(outputPath)
}

export function getSvgoConfig(hasRemoveXmlnsPlugin: boolean): Config {
  const pluginPresetDefault = {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
        inlineStyles: {
          onlyMatchedOnce: false,
        },
      },
    },
  }

  const convertColors = {
    name: 'convertColors',
    params: {
      currentColor: true,
    },
  }
  const plugins = [
    'removeDimensions',
    pluginPresetDefault,
    convertColors,
  ]

  if (hasRemoveXmlnsPlugin) {
    plugins.push('removeXMLNS')
  }

  return {
    plugins,
  } as Config
}
