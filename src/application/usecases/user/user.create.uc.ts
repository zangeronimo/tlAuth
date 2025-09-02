import { UserCredentialsModel } from '@application/models/users/user-credentials.model'
import { UserDto } from '@domain/dto'
import { Company, Credential } from '@domain/entity'
import { User } from '@domain/entity/user'
import { numberToActiveEnum } from '@domain/enum/active.enum'
import { EmailAlreadyExistsError } from '@domain/errors/email.already.exists.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import {
  type ISystemRepository,
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
  credentials: UserCredentialsModel[]
}

@injectable()
export class UserCreateUC implements UseCase<Props, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    name,
    email,
    active,
    companies,
    credentials,
  }: Props): Promise<UserDto> {
    const companyArray: Company[] = []
    for (const companyId of companies) {
      const company = await this.companyRepository.getByIdAsync(companyId)
      if (!company) throw new NotFoundError('Company ID', companyId)
      companyArray.push(company)
    }
    const credentialArray: Credential[] = []
    for (const credential of credentials) {
      const system = await this.systemRepository.getByIdAsync(
        credential.systemId,
      )
      if (!system) throw new NotFoundError('System ID', credential.systemId)
      credentialArray.push(
        Credential.create(
          credential.systemId,
          credential.password!,
          numberToActiveEnum(credential.active),
        ),
      )
    }
    const user = User.create(
      name,
      email,
      numberToActiveEnum(active),
      companyArray,
      credentialArray,
    )
    const userSaved = await this.userRepository.getByEmailAsync(user.email)
    if (userSaved) throw new EmailAlreadyExistsError(user.email.value!)
    const result = await this.userRepository.createAsync(user)
    return UserDto.from(result)
  }
}

