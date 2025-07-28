import { ProviderExtensions } from './provider.extensions'
import { RepositoryExtensions } from './repository.extensions'
import { UseCaseExtensions } from './usecase.extensions'

export class ExtensionDI {
  static init = () => {
    RepositoryExtensions.init()
    ProviderExtensions.init()
    UseCaseExtensions.init()
  }
}

