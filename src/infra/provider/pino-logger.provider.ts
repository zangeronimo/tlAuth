import { LoggerProvider } from '@domain/interface/provider'
import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
})

export class PinoLoggerProvider implements LoggerProvider {
  info(message: string, meta?: Record<string, unknown>) {
    logger.info(meta, message)
  }

  warn(message: string, meta?: Record<string, unknown>) {
    logger.warn(meta, message)
  }

  error(message: string, meta?: Record<string, unknown>) {
    logger.error(meta, message)
  }

  debug(message: string, meta?: Record<string, unknown>) {
    logger.debug(meta, message)
  }
}

