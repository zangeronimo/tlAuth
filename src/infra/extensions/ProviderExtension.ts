import { container } from 'tsyringe'
import { DbContext, PgPromiseContext } from '@infra/context'
import { LoggerProvider } from '@domain/interface/provider/LoggerProvider'
import { PinoLoggerProvider } from '@infra/provider/PinoLoggerProvider'

export class ProviderExtension {
  static init() {
    container.registerSingleton<DbContext>('DbContext', PgPromiseContext)
    container.registerSingleton<LoggerProvider>(
      'LoggerProvider',
      PinoLoggerProvider,
    )
  }
}

