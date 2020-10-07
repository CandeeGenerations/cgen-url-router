/* eslint-disable no-undef */
const {LOG_LEVEL, NODE_ENV} = process.env

export const NEST_LOGGER_NAME = 'NestLogger'

// allow overriding the debug log level with an ENV variable or NODE_ENV
export const enableDebugLogging =
  LOG_LEVEL === 'debug' ? true : NODE_ENV === 'development'
