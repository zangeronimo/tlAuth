import { UserDto } from '@domain/dto'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserGetAllUC implements UseCase<undefined, UserDto[]> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync(): Promise<UserDto[]> {
    const users = await this.userRepository.getAllAsync()
    const usersDto = users.map(user => UserDto.from(user))
    return usersDto
  }
}

