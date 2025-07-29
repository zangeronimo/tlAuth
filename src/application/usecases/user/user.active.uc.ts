import { UserDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  active: number
}

@injectable()
export class UserActiveUC implements UseCase<Props, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync({ id, active }: Props): Promise<UserDto> {
    const user = await this.userRepository.getByIdAsync(id)
    if (!user) throw new NotFoundError('User', id)
    user.active(active)
    const result = await this.userRepository.updateAsync(user)
    return UserDto.from(result)
  }
}

