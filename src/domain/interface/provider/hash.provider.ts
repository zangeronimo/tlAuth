export interface HashProvider {
  generateHash(payload: string): { hash: string; salt: string }
  compareHash(payload: string, salt: string, hashed: string): boolean
}

