import { container } from 'tsyringe'
import { DbContext, PgPromiseContext } from '@infra/context'
import { LoggerProvider } from '@domain/interface/provider'
import { PinoLoggerProvider } from '@infra/provider'

export class ProviderExtensions {
  static init() {
    container.registerSingleton<DbContext>('DbContext', PgPromiseContext)
    container.registerSingleton<LoggerProvider>(
      'LoggerProvider',
      PinoLoggerProvider,
    )
  }
}

