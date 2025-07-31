import { CompanyUseCaseExtensions } from './company.usecase.extensions'
import { ProviderExtensions } from './provider.extensions'
import { RepositoryExtensions } from './repository.extensions'
import { SystemUseCaseExtensions } from './system.usecase.extension'
import { UserUseCaseExtensions } from './user.usecase.extensions'

export class ExtensionDI {
  static init = () => {
    RepositoryExtensions.init()
    ProviderExtensions.init()
    CompanyUseCaseExtensions.init()
    SystemUseCaseExtensions.init()
    UserUseCaseExtensions.init()
  }
}

