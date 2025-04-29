import { Logger, type ILogObj } from 'tslog'

enum LogLevel {
  SILLY = 0,
  TRACE = 1,
  DEBUG = 2,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6,
}

const isProd = import.meta?.env?.PROD ?? false

declare let window: {
  EnvVars: any
} & Window

// https://tslog.js.org/#/?id=minlevel
const getMinLevel = () => {
  const LoggerLevel = typeof window === 'undefined' ? undefined : window.EnvVars?.VITE_LOGGER_LEVEL
  const defaultLevel = isProd ? LogLevel.ERROR : LogLevel.INFO
  return LoggerLevel || defaultLevel
}

export const logger: Logger<ILogObj> = new Logger({ minLevel: getMinLevel(),
  prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}} ',
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'green'],
      TRACE: ['bold', 'green'],
      DEBUG: ['bold', 'red'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright'],
    },
  },
})
