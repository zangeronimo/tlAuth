import { SystemDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SystemGetByIdUC implements UseCase<string, SystemDto | undefined> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync(id: string): Promise<SystemDto | undefined> {
    const system = await this.systemRepository.getByIdAsync(id)
    if (!system) throw new NotFoundError('System', id)
    const systemDto = system ? SystemDto.from(system) : undefined
    return systemDto
  }
}

