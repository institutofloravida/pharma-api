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
import { FetchOperatorsController } from './controllers/fetch-operators.controller'
import { FethOperatorsUseCase } from '@/domain/pharma/application/use-cases/operator/fetch-operators'
import { FetchInstitutionsController } from './controllers/fetch-institutions.controller'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/fetch-institutions'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountOperatorController,
    AuthenticateOperatorController,
    CreateTherapeuticClassController,
    ValidateTokenController,
    FetchOperatorsController,
    FetchInstitutionsController,
  ],
  providers: [
    RegisterOperatorUseCase,
    AuthenticateOperatorUseCase,
    CreateTherapeuticClassUseCase,
    FethOperatorsUseCase,
    FethInstitutionsUseCase,
  ],
})
export class HttpModule {}
