import { SystemActiveUC } from '@application/usecases/system/system.active.uc'
import { SystemCreateUC } from '@application/usecases/system/system.create.uc'
import { SystemDeleteUC } from '@application/usecases/system/system.delete.uc'
import { SystemGetAllUC } from '@application/usecases/system/system.get.all.uc'
import { SystemGetByIdUC } from '@application/usecases/system/system.get.by.id.uc'
import { SystemUpdateUC } from '@application/usecases/system/system.update.uc'
import { SystemDto } from '@domain/dto/system.dto'
import { type UseCase } from '@domain/interface/use.case'
import { container } from 'tsyringe'

export class SystemUseCaseExtensions {
  static init() {
    container.registerSingleton<UseCase<undefined, SystemDto[]>>(
      'SystemGetAllUC',
      SystemGetAllUC,
    )
    container.registerSingleton<UseCase<string, SystemDto | undefined>>(
      'SystemGetByIdUC',
      SystemGetByIdUC,
    )
    container.registerSingleton<
      UseCase<{ name: string; description: string }, SystemDto>
    >('SystemCreateUC', SystemCreateUC)
    container.registerSingleton<
      UseCase<{ name: string; active: number }, SystemDto>
    >('SystemUpdateUC', SystemUpdateUC)
    container.registerSingleton<UseCase<string, SystemDto>>(
      'SystemDeleteUC',
      SystemDeleteUC,
    )
    container.registerSingleton<
      UseCase<{ id: string; active: number }, SystemDto>
    >('SystemActiveUC', SystemActiveUC)
  }
}

