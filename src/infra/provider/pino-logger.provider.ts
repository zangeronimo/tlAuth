import { LoggerProvider } from '@domain/interface/provider'
import pino, { Logger } from 'pino'
import { injectable } from 'tsyringe'

@injectable()
export class PinoLoggerProvider implements LoggerProvider {
  private logger: Logger

  constructor() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: { colorize: true },
            }
          : undefined,
    })
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.logger.info(meta, message)
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.logger.warn(meta, message)
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.logger.error(meta, message)
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.logger.debug(meta, message)
  }
}

