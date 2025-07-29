import { UserActiveUC } from '@application/usecases/user/user.active.uc'
import { UserCreateUC } from '@application/usecases/user/user.create.uc'
import { UserDeleteUC } from '@application/usecases/user/user.delete.uc'
import { UserGetAllUC } from '@application/usecases/user/user.get.all.uc'
import { UserGetByIdUC } from '@application/usecases/user/user.get.by.id.uc'
import { UserUpdateUC } from '@application/usecases/user/user.update.uc'
import { UserDto } from '@domain/dto'
import { type UseCase } from '@domain/interface/use.case'
import { container } from 'tsyringe'

export class UserUseCaseExtensions {
  static init() {
    container.registerSingleton<UseCase<'', UserDto[]>>(
      'UserGetAllUC',
      UserGetAllUC,
    )
    container.registerSingleton<UseCase<string, UserDto | undefined>>(
      'UserGetByIdUC',
      UserGetByIdUC,
    )
    container.registerSingleton<
      UseCase<{ name: string; active: number }, UserDto>
    >('UserCreateUC', UserCreateUC)
    container.registerSingleton<
      UseCase<{ name: string; active: number }, UserDto>
    >('UserUpdateUC', UserUpdateUC)
    container.registerSingleton<UseCase<string, UserDto>>(
      'UserDeleteUC',
      UserDeleteUC,
    )
    container.registerSingleton<
      UseCase<{ id: string; active: number }, UserDto>
    >('UserActiveUC', UserActiveUC)
  }
}

