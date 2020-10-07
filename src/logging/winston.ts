import {LoggerService, Provider} from '@nestjs/common'

import * as winston from 'winston'
import * as Transport from 'winston-transport'

import {NEST_LOGGER_NAME, enableDebugLogging} from './constants'

/* eslint-disable no-undef */
const {LOG_LEVEL, NODE_ENV} = process.env

const debugLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  winston.format.printf(info => `${info.level}: ${info.message}`),
)
const defaultLogLevel = enableDebugLogging ? 'debug' : 'info'
const consoleLogLevel = LOG_LEVEL || defaultLogLevel

const transports: Transport[] = [
  new winston.transports.Console({
    format: NODE_ENV === 'development' ? debugLogFormat : winston.format.json(),
    level: consoleLogLevel,
  }),
]

export function getLoggerOptions(): winston.LoggerOptions {
  return {
    format: winston.format.json(),
    transports,
  }
}

export function createLogger(): winston.Logger {
  const logger = winston.createLogger(getLoggerOptions())

  // always log this info message on startup, then revert right back
  transports[0].level = 'info'
  logger.info(`Logger started with log level: ${consoleLogLevel}`)
  transports[0].level = consoleLogLevel

  return logger
}

class WinstonNestLogger implements LoggerService {
  constructor(private readonly logger: winston.Logger) {}

  public log(message: string, context?: string): winston.Logger {
    return this.logger.info(message, {context})
  }

  public error(
    message: string,
    trace?: string,
    context?: string,
  ): winston.Logger {
    return this.logger.error(message, {trace, context})
  }

  public warn(message: string, context?: string): winston.Logger {
    return this.logger.warn(message, {context})
  }

  public debug?(message: string, context?: string): winston.Logger {
    return this.logger.debug(message, {context})
  }

  public verbose?(message: string, context?: string): winston.Logger {
    return this.logger.verbose(message, {context})
  }
}

export function getProvider(injected: any): Provider {
  return {
    provide: NEST_LOGGER_NAME,
    useFactory: (logger: winston.Logger): WinstonNestLogger => {
      return new WinstonNestLogger(logger)
    },
    inject: [injected],
  }
}
