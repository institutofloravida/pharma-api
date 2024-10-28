import { Module } from '@nestjs/common'
import { CreateAccountOperatorController } from './controllers/create-account-operator.controler'
import { AuthenticateOperatorController } from './controllers/authenticate-operator.controller'
import { CreateTherapeuticClassController } from './controllers/create-therapeutic-class.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { AuthenticateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/authenticate-operator'
import { CreateTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/create-therapeutic-class'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { ValidateTokenController } from './controllers/validate-token'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountOperatorController, AuthenticateOperatorController, CreateTherapeuticClassController, ValidateTokenController],
  providers: [RegisterOperatorUseCase, AuthenticateOperatorUseCase, CreateTherapeuticClassUseCase],
})
export class HttpModule {}
