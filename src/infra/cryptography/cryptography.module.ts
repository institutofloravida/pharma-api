import { Encrypter } from '@/domain/pharma/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { HashComparer } from '@/domain/pharma/application/cryptography/hash-compare'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/pharma/application/cryptography/hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [
    Encrypter, HashComparer, HashGenerator,
  ],
})
export class CryptographyModule {}
