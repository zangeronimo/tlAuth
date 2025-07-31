import { SystemDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SystemDeleteUC implements UseCase<string, SystemDto> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync(id: string): Promise<SystemDto> {
    const system = await this.systemRepository.getByIdAsync(id)
    if (!system) throw new NotFoundError('System', id)
    system.delete()
    const result = await this.systemRepository.deleteAsync(system)
    return SystemDto.from(result)
  }
}

