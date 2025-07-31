import { SystemDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  name: string
  description: string
  active: number
}

@injectable()
export class SystemUpdateUC implements UseCase<Props, SystemDto> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    id,
    name,
    description,
    active,
  }: Props): Promise<SystemDto> {
    const system = await this.systemRepository.getByIdAsync(id)
    if (!system) throw new NotFoundError('System', id)
    system.update(name, description, active)
    const systemSaved = await this.systemRepository.getBySlugAsync(system.slug)
    if (systemSaved && systemSaved.id !== id)
      throw new SlugAlreadyExistsError(system.slug.value!)
    const result = await this.systemRepository.updateAsync(system)
    return SystemDto.from(result)
  }
}

