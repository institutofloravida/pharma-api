import { Module } from '@nestjs/common'
import { CreateAccountOperatorController } from './controllers/auxiliary-records/operator/create-account-operator.controler'
import { AuthenticateOperatorController } from './controllers/auxiliary-records/operator/authenticate-operator.controller'
import { CreateTherapeuticClassController } from './controllers/auxiliary-records/therapeutic-class/create-therapeutic-class.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { AuthenticateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/authenticate-operator'
import { CreateTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/create-therapeutic-class'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { ValidateTokenController } from './controllers/auth/validate-token'
import { FetchOperatorsController } from './controllers/auxiliary-records/operator/fetch-operators.controller'
import { FethOperatorsUseCase } from '@/domain/pharma/application/use-cases/operator/fetch-operators'
import { FetchInstitutionsController } from './controllers/auxiliary-records/institution/fetch-institutions.controller'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/fetch-institutions'
import { CreateInstitutionController } from './controllers/auxiliary-records/institution/create-institution.contoller'
import { CreateInstitutionUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/create-institution'
import { CreateStockController } from './controllers/auxiliary-records/stock/create-stock.controller'
import { CreateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/create-stock'
import { FetchStocksController } from './controllers/auxiliary-records/stock/fetch-stocks-controller'
import { FetchStocksUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/fetch-stocks'
import { FetchTerapeuticClasssController } from './controllers/auxiliary-records/therapeutic-class/fetch-therapeutic-class.controller'
import { FetchTherapeuticClassesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/fetch-therapeutic-classes'
import { FetchPharmaceuticalFormController } from './controllers/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form.controller'
import { FetchPharmaceuticalFormsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { GetOperatorDetailsController } from './controllers/auxiliary-records/operator/get-operator-details.controller'
import { GetOperatorDetailsUseCase } from '@/domain/pharma/application/use-cases/operator/get-operator-details'
import { CreatePharmaceuticalFormController } from './controllers/auxiliary-records/pharmaceutical-form/create-pharmaceutical-form.controller'
import { CreatePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/create-pharmaceutical-form'
import { CreateManufacturerController } from './controllers/auxiliary-records/manufacturer/create-manufacturer.controller'
import { CreateManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/create-manufacturer'
import { FetchManufacturersController } from './controllers/auxiliary-records/manufacturer/fetch-manufacturer.controller'
import { FetchManufacturersUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/fetch-manufacturers'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    GetOperatorDetailsController,
    AuthenticateOperatorController,
    ValidateTokenController,
    CreateAccountOperatorController,
    CreateTherapeuticClassController,
    CreateInstitutionController,
    CreateStockController,
    CreatePharmaceuticalFormController,
    CreateManufacturerController,
    FetchOperatorsController,
    FetchInstitutionsController,
    FetchStocksController,
    FetchTerapeuticClasssController,
    FetchPharmaceuticalFormController,
    FetchManufacturersController,

  ],
  providers: [
    GetOperatorDetailsUseCase,
    AuthenticateOperatorUseCase,
    RegisterOperatorUseCase,
    CreateTherapeuticClassUseCase,
    CreateInstitutionUseCase,
    CreateStockUseCase,
    CreatePharmaceuticalFormUseCase,
    CreateManufacturerUseCase,
    FethOperatorsUseCase,
    FethInstitutionsUseCase,
    FetchStocksUseCase,
    FetchTherapeuticClassesUseCase,
    FetchPharmaceuticalFormsUseCase,
    FetchManufacturersUseCase,
  ],
})
export class HttpModule {}
