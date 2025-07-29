import { UserDto } from '@domain/dto/'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserDeleteUC implements UseCase<string, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync(id: string): Promise<UserDto> {
    const user = await this.userRepository.getByIdAsync(id)
    if (!user) throw new NotFoundError('User', id)
    user.delete()
    const result = await this.userRepository.deleteAsync(user)
    return UserDto.from(result)
  }
}

