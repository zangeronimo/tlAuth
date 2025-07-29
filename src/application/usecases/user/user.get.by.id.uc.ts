import { UserDto } from '@domain/dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserGetByIdUC implements UseCase<string, UserDto | undefined> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync(id: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.getByIdAsync(id)
    if (!user) throw new NotFoundError('User', id)
    const userDto = user ? UserDto.from(user) : undefined
    return userDto
  }
}

