import { rmSync, existsSync, mkdirSync } from 'fs'
import { type Config } from 'svgo'


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

export function clearFolder(outputPath: string) {
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
  mkdirSync(outputPath)
}

export function getSvgoConfig(hasRemoveXmlnsPlugin: boolean, isMonochrome: boolean): Config {
  const convertColors = {
    name: 'convertColors',
    params: {
      currentColor: true,
    },
  }
  const plugins: any[] = [
    'removeDimensions',
    pluginPresetDefault,
  ]
  if (isMonochrome) {
    plugins.push(convertColors)
  }

  if (hasRemoveXmlnsPlugin) {
    plugins.push('removeXMLNS')
  }

  return {
    plugins,
  } as Config
}


export function getSvgoConfigForImg(): Config {
  const plugins = [
    'removeDimensions',
    pluginPresetDefault,
  ]

  return {
    plugins,
  } as Config
}
