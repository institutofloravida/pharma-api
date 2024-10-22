import { hash, compare } from 'bcryptjs'
import type { HashComparer } from '@/domain/pharma/application/cryptography/hash-compare'
import type { HashGenerator } from '@/domain/pharma/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private SALT_ROUNDS = 8
  async hash(plain: string): Promise<string> {
    return await hash(plain, this.SALT_ROUNDS)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
