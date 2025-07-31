import { SystemDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  active: number
}

@injectable()
export class SystemActiveUC implements UseCase<Props, SystemDto> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({ id, active }: Props): Promise<SystemDto> {
    const system = await this.systemRepository.getByIdAsync(id)
    if (!system) throw new NotFoundError('System', id)
    system.active(active)
    const result = await this.systemRepository.updateAsync(system)
    return SystemDto.from(result)
  }
}

