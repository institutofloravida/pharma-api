import type { HashComparer } from '@/domain/pharma/application/cryptography/hash-compare'
import type { HashGenerator } from '@/domain/pharma/application/cryptography/hash-generator'

export class FakerHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}