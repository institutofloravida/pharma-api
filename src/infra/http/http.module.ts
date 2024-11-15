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
import { CreateUnitMeasureController } from './controllers/auxiliary-records/unit-measure/create-unit-measure.controller'
import { CreateUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/create-unit-measure'
import { FetchUnitsMeasureController } from './controllers/auxiliary-records/unit-measure/fetch-units-measure.controller'
import { FetchUnitsMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/fetch-units-measure'
import { CreatePathologyController } from './controllers/auxiliary-records/pathology/create-pathology.controller'
import { CreatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/create-pathology'
import { FetchpathologiesController } from './controllers/auxiliary-records/pathology/fetch-pathologies.controller'
import { FetchPathologiesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/fetch-pathologies'
import { CreateMedicineController } from './controllers/medicine/medicine/create-medicine.controller'
import { CreateMedicineUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine/create-medicine'
import { FetchMedicinesUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine/fetch-medicines'
import { FetchmedicinesController } from './controllers/medicine/medicine/fetch-medicines.controller'
import { CreateMedicineVariantController } from './controllers/medicine/medicine-variant/create-medicine-variant.controller'
import { CreateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine-variant/create-medicine-variant'

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
    CreateUnitMeasureController,
    CreatePathologyController,
    CreateMedicineController,
    CreateMedicineVariantController,
    FetchOperatorsController,
    FetchInstitutionsController,
    FetchStocksController,
    FetchTerapeuticClasssController,
    FetchPharmaceuticalFormController,
    FetchManufacturersController,
    FetchUnitsMeasureController,
    FetchpathologiesController,
    FetchmedicinesController,

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
    CreateUnitMeasureUseCase,
    CreatePathologyUseCase,
    CreateMedicineUseCase,
    CreateMedicineVariantUseCase,
    FethOperatorsUseCase,
    FethInstitutionsUseCase,
    FetchStocksUseCase,
    FetchTherapeuticClassesUseCase,
    FetchPharmaceuticalFormsUseCase,
    FetchManufacturersUseCase,
    FetchUnitsMeasureUseCase,
    FetchPathologiesUseCase,
    FetchMedicinesUseCase,
  ],
})
export class HttpModule {}
