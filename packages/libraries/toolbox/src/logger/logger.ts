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
  const loggerLevel = typeof window === 'undefined' ? undefined : window.EnvVars?.VITE_LOGGER_LEVEL
  const defaultLevel = isProd ? LogLevel.ERROR : LogLevel.INFO
  return loggerLevel || defaultLevel
}

// tslog formats errors via String(prop), which throws on null-prototype objects.
// Since axios 1.16 (PR #10833), AxiosError#config is built with a null prototype
// as prototype-pollution hardening, so String(error.config) throws TypeError and
// escapes the caller's catch. A JSON round-trip rebuilds offending fields as
// plain objects without ever coercing to a primitive.
function makeErrorFieldsStringifiable(args: unknown[]): unknown[] {
  for (const arg of args) {
    if (arg instanceof Error === false) {
      continue
    }
    try {
      // NOSONAR: not a deep clone — the JSON round-trip is intentional to strip
      // null-prototype sub-objects (e.g. AxiosError#config) and non-serializable
      // fields (functions, symbols). structuredClone would throw on those.
      Object.assign(arg, JSON.parse(JSON.stringify(arg)))
    } catch {
      // best-effort: leave the error untouched if it cannot be serialized
    }
  }
  return args
}

export const logger: Logger<ILogObj> = new Logger({
  minLevel: getMinLevel(),
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
  overwrite: {
    mask: makeErrorFieldsStringifiable,
  },
})
