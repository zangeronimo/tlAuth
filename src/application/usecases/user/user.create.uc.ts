import { UserDto } from '@domain/dto'
import { User } from '@domain/entity/user'
import { numberToActiveEnum } from '@domain/enum/active.enum'
import { EmailAlreadyExistsError } from '@domain/errors/email.already.exists.error'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  name: string
  email: string
  active: number
  companies: string[]
}

@injectable()
export class UserCreateUC implements UseCase<Props, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync({
    name,
    email,
    active,
    companies,
  }: Props): Promise<UserDto> {
    const user = User.create(name, email, numberToActiveEnum(active), companies)
    const userSaved = await this.userRepository.getByEmailAsync(user.email)
    if (userSaved) throw new EmailAlreadyExistsError(user.email.value!)
    const result = await this.userRepository.createAsync(user)
    return UserDto.from(result)
  }
}

