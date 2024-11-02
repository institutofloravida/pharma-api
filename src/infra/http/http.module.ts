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
import { CreateInstitutionController } from './controllers/create-institution.contoller'
import { CreateInstitutionUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/create-institution'
import { CreateStockController } from './controllers/create-stock.controller'
import { CreateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/create-stock'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateOperatorController,
    ValidateTokenController,
    CreateAccountOperatorController,
    CreateTherapeuticClassController,
    CreateInstitutionController,
    CreateStockController,
    FetchOperatorsController,
    FetchInstitutionsController,
  ],
  providers: [
    AuthenticateOperatorUseCase,
    RegisterOperatorUseCase,
    CreateTherapeuticClassUseCase,
    CreateInstitutionUseCase,
    CreateStockUseCase,
    FethOperatorsUseCase,
    FethInstitutionsUseCase,
  ],
})
export class HttpModule {}
