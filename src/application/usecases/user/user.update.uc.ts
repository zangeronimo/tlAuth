import { UserCredentialsModel } from '@application/models/users/user-credentials.model'
import { UserDto } from '@domain/dto/user.dto'
import { Company, Credential } from '@domain/entity'
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
  id: string
  name: string
  email: string
  active: number
  companies: string[]
  credentials: UserCredentialsModel[]
}

@injectable()
export class UserUpdateUC implements UseCase<Props, UserDto> {
  constructor(
    @inject('IUserRepository')
    readonly userRepository: IUserRepository,
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    id,
    name,
    email,
    active,
    companies,
    credentials,
  }: Props): Promise<UserDto> {
    const user = await this.userRepository.getByIdAsync(id)
    if (!user) throw new NotFoundError('User', id)
    const companyArray: Company[] = []
    for (const companyId of companies) {
      const company = await this.companyRepository.getByIdAsync(companyId)
      if (!company) throw new NotFoundError('Company ID', companyId)
      companyArray.push(company)
    }
    const credentialArray: Credential[] = []
    for (const credential of credentials) {
      if (!credential.id) {
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
      } else {
        const credentialOfUser = user.credentials.find(
          cred => cred.id === credential.id,
        )
        if (!credentialOfUser)
          throw new NotFoundError('Credential ID', credential.id)
        credentialOfUser.update(credential.active, credential.password)
        credentialArray.push(credentialOfUser)
      }
    }
    const allUpdateCredentialIds = credentials
      .filter(credential => credential.id)
      .map(credential => credential.id)
    for (const credential of user.credentials) {
      if (!allUpdateCredentialIds.includes(credential.id)) {
        user.credentials.forEach(cred => {
          if (cred.id === credential.id) {
            cred.delete()
            credentialArray.push(cred)
          }
        })
      }
    }
    user.update(name, email, active, companyArray, credentialArray)
    const userSaved = await this.userRepository.getByEmailAsync(user.email)
    if (userSaved && userSaved.id !== id)
      throw new EmailAlreadyExistsError(user.email.value!)
    const result = await this.userRepository.updateAsync(user)
    return UserDto.from(result)
  }
}

