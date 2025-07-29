import { UserDto } from '@domain/dto'
import { Company } from '@domain/entity'
import { User } from '@domain/entity/user'
import { numberToActiveEnum } from '@domain/enum/active.enum'
import { EmailAlreadyExistsError } from '@domain/errors/email.already.exists.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import {
  type ICompanyRepository,
  type IUserRepository,
} from '@domain/interface/repository'
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
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync({
    name,
    email,
    active,
    companies,
  }: Props): Promise<UserDto> {
    const companyArray: Company[] = []
    for (const companyId of companies) {
      const company = await this.companyRepository.getByIdAsync(companyId)
      if (!company) throw new NotFoundError('Company ID', companyId)
      companyArray.push(company)
    }
    const user = User.create(
      name,
      email,
      numberToActiveEnum(active),
      companyArray,
    )
    const userSaved = await this.userRepository.getByEmailAsync(user.email)
    if (userSaved) throw new EmailAlreadyExistsError(user.email.value!)
    const result = await this.userRepository.createAsync(user)
    return UserDto.from(result)
  }
}

