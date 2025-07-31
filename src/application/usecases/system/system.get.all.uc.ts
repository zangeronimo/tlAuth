import { SystemDto } from '@domain/dto'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SystemGetAllUC implements UseCase<undefined, SystemDto[]> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync(): Promise<SystemDto[]> {
    const systems = await this.systemRepository.getAllAsync()
    const systemsDto = systems.map(system => SystemDto.from(system))
    return systemsDto
  }
}

