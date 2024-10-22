import { Encrypter } from '@/domain/pharma/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypter(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
}
