import { HashProvider } from '@domain/interface/provider'
import crypto from 'crypto'
import { injectable } from 'tsyringe'

@injectable()
export class BPKDF2HashProvider implements HashProvider {
  public generateHash(payload: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(20).toString('hex')
    const hash = crypto
      .pbkdf2Sync(payload, salt, 100, 64, 'sha512')
      .toString('hex')
    return { hash, salt }
  }

  public compareHash(payload: string, salt: string, hashed: string): boolean {
    const value = crypto
      .pbkdf2Sync(payload, salt, 100, 64, 'sha512')
      .toString('hex')
    return hashed === value
  }
}

