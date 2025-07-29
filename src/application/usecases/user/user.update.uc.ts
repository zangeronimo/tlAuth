import { UserDto } from '@domain/dto/user.dto'
import { EmailAlreadyExistsError } from '@domain/errors/email.already.exists.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type IUserRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  name: string
  email: string
  active: number
  companies: string[]
}

@injectable()
export class UserUpdateUC implements UseCase<Props, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
  ) {}
  async executeAsync({
    id,
    name,
    email,
    active,
    companies,
  }: Props): Promise<UserDto> {
    const user = await this.userRepository.getByIdAsync(id)
    if (!user) throw new NotFoundError('User', id)
    user.update(name, email, active, companies)
    const userSaved = await this.userRepository.getByEmailAsync(user.email)
    if (userSaved && userSaved.id !== id)
      throw new EmailAlreadyExistsError(user.email.value!)
    const result = await this.userRepository.updateAsync(user)
    return UserDto.from(result)
  }
}

