import { SystemDto } from '@domain/dto'
import { System } from '@domain/entity'
import { ActiveEnum } from '@domain/enum/active.enum'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import { type ISystemRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  name: string
  description: string
  modules?: { name: string; description: string; active: ActiveEnum }[]
}

@injectable()
export class SystemCreateUC implements UseCase<Props, SystemDto> {
  constructor(
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    name,
    description,
    modules,
  }: Props): Promise<SystemDto> {
    const system = System.create(name, description)
    const systemSaved = await this.systemRepository.getBySlugAsync(system.slug)
    if (systemSaved) throw new SlugAlreadyExistsError(system.slug.value!)
    const result = await this.systemRepository.createAsync(system, modules)
    return SystemDto.from(result)
  }
}

