import { container } from 'tsyringe'
import { DbContext, PgPromiseContext } from '@infra/context'
import { HashProvider, LoggerProvider } from '@domain/interface/provider'
import { BPKDF2HashProvider, PinoLoggerProvider } from '@infra/provider'

export class ProviderExtensions {
  static init() {
    container.registerSingleton<DbContext>('DbContext', PgPromiseContext)
    container.registerSingleton<LoggerProvider>(
      'LoggerProvider',
      PinoLoggerProvider,
    )
    container.registerSingleton<HashProvider>(
      'HashProvider',
      BPKDF2HashProvider,
    )
  }
}

