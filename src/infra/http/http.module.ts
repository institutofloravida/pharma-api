import { Module } from '@nestjs/common'
import { CreateAccountOperatorController } from './controllers/auth/create-account-operator.controller'
import { AuthenticateOperatorController } from './controllers/auth/authenticate-operator.controller'
import { CreateTherapeuticClassController } from './controllers/auxiliary-records/therapeutic-class/create-therapeutic-class.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { AuthenticateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/authenticate-operator'
import { CreateTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/create-therapeutic-class'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { ValidateTokenController } from './controllers/auth/validate-token.controller'
import { FetchOperatorsController } from './controllers/operator/fetch-operators.controller'
import { FethOperatorsUseCase } from '@/domain/pharma/application/use-cases/operator/fetch-operators'
import { FetchInstitutionsController } from './controllers/auxiliary-records/institution/fetch-institutions.controller'
import { CreateInstitutionController } from './controllers/auxiliary-records/institution/create-institution.controller'
import { CreateStockController } from './controllers/auxiliary-records/stock/create-stock.controller'
import { CreateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/create-stock'
import { FetchStocksController } from './controllers/auxiliary-records/stock/fetch-stocks.controller'
import { FetchStocksUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/fetch-stocks'
import { FetchTerapeuticClasssController } from './controllers/auxiliary-records/therapeutic-class/fetch-therapeutic-class.controller'
import { FetchTherapeuticClassesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/fetch-therapeutic-classes'
import { FetchPharmaceuticalFormController } from './controllers/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form.controller'
import { FetchPharmaceuticalFormsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { GetOperatorDetailsController } from './controllers/operator/get-operator-details.controller'
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
import { CreateMedicineVariantController } from './controllers/medicine/medicine-variant/create-medicine-variant.controller'
import { FetchMedicinesVariantsController } from './controllers/medicine/medicine-variant/fetch-medicine-variant.controller'
import { FetchMedicinesController } from './controllers/medicine/medicine/fetch-medicines.controller'
import { RegisterMedicineEntryController } from './controllers/movimentation/entry/register-medicine-entry.controller'
import { RegisterMedicineEntryUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/register-medicine-entry'
import { FetchRegisterMedicinesEntriesUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/fetch-register-medicines-entries'
import { FetchMedicinesEntriesController } from './controllers/movimentation/entry/fetch-medicines-entries.controller'
import { FetchBatchesController } from './controllers/auxiliary-records/batch/fetch-batches.controller'
import { FetchBatchesUseCase } from '@/domain/pharma/application/use-cases/stock/batch/fetch-batches'
import { CreatePatientController } from './controllers/patient/create-patient.controller'
import { CreatePatientUseCase } from '@/domain/pharma/application/use-cases/patient/create-patient'
import { FetchPatientsController } from './controllers/patient/fetch-patients.controller'
import { FetchPatientsUseCase } from '@/domain/pharma/application/use-cases/patient/fetch-pacients'
import { DispensationController } from './controllers/dispensation/create-dispensation.controller'
import { DispensationMedicineUseCase } from '@/domain/pharma/application/use-cases/dispensation/dispensation-medicine'
import { FetchDispensationsController } from './controllers/dispensation/fetch-dispensations.controller'
import { FetchDispensationsUseCase } from '@/domain/pharma/application/use-cases/dispensation/fetch-dispensation'
import { CreateMovementTypeController } from './controllers/auxiliary-records/movement-type/create-movement-type.controller'
import { CreateMovementTypeUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/movement-type/create-movement-type'
import { CreateInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/create-institution'
import { CreateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/create-medicine-variant'
import { FetchMedicinesVariantsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/fetch-medicines-variants'
import { CreateMedicineUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/create-medicine'
import { FetchMedicinesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/fetch-medicines'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/institution/fetch-institutions'
import { FetchBatchesStockController } from './controllers/stock/batch-stock/fetch-batches-stock.controller'
import { FetchBatchesStockUseCase } from '@/domain/pharma/application/use-cases/stock/batch-stock/fetch-batches-stock'
import { FetchMedicinesStockController } from './controllers/stock/medicine-stock/fetch-medicines-stock.controller'
import { FetchMedicinesStockUseCase } from '@/domain/pharma/application/use-cases/stock/medicine-stock/fetch-medicine-stock'
import { FetchmovementTypesController } from './controllers/auxiliary-records/movement-type/fetch-movement-types.controller'
import { FetchMovementTypesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/movement-type/fetch-movement-type'
import { UpdateInstitutionController } from './controllers/auxiliary-records/institution/update-institution.controller'
import { UpdateInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/update-institution'
import { GetInstitutionController } from './controllers/auxiliary-records/institution/get-institution.controller'
import { GetInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/get-institution'
import { GetPathologyController } from './controllers/auxiliary-records/pathology/get-pathology.controller'
import { GetPathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/get-pathology'
import { UpdatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/update-pathology'
import { UpdatePathologyController } from './controllers/auxiliary-records/pathology/update-pathology.controller'
import { GetTherapeuticClassController } from './controllers/auxiliary-records/therapeutic-class/get-therapeutic-class.controller'
import { GetTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/get-therapeutic-class'
import { UpdateTherapeuticClassController } from './controllers/auxiliary-records/therapeutic-class/update-therapeutic-class.controller'
import { UpdateTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/update-therapeutic-class'
import { GetPharmaceuticalFormController } from './controllers/auxiliary-records/pharmaceutical-form/get-pharmaceutical-form.controller'
import { GetPharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/get-pharmaceutical-form'
import { UpdatePharmaceuticalFormController } from './controllers/auxiliary-records/pharmaceutical-form/update-pharmaceutical-form.controller'
import { UpdatePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/update-pharmaceutical-form'
import { GetManufacturerController } from './controllers/auxiliary-records/manufacturer/get-manufacturer.controller'
import { GetManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/get-manufacturer'
import { UpdateManufacturerController } from './controllers/auxiliary-records/manufacturer/update-manufacturer.controller'
import { UpdateManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/update-manufacturer'
import { GetUnitMeasureController } from './controllers/auxiliary-records/unit-measure/get-unit-measure.controller'
import { GetUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/get-unit-measure'
import { UpdateUnitMeasureController } from './controllers/auxiliary-records/unit-measure/update-unit-measure.controller'
import { UpdateUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/update-unit-measure'
import { UpdateOperatorController } from './controllers/operator/update-operator.controller'
import { UpdateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/update-operator'
import { GetOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/get-operator'
import { GetOperatorController } from './controllers/operator/get-operator.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateOperatorController,
    ValidateTokenController,
    GetOperatorDetailsController,
    GetInstitutionController,
    GetPathologyController,
    GetTherapeuticClassController,
    GetPharmaceuticalFormController,
    GetManufacturerController,
    GetUnitMeasureController,
    GetOperatorController,
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
    CreatePatientController,
    CreateMovementTypeController,
    DispensationController,
    RegisterMedicineEntryController,
    FetchOperatorsController,
    FetchInstitutionsController,
    FetchStocksController,
    FetchTerapeuticClasssController,
    FetchPharmaceuticalFormController,
    FetchManufacturersController,
    FetchUnitsMeasureController,
    FetchpathologiesController,
    FetchMedicinesController,
    FetchMedicinesVariantsController,
    FetchMedicinesEntriesController,
    FetchBatchesController,
    FetchPatientsController,
    FetchDispensationsController,
    FetchBatchesStockController,
    FetchMedicinesStockController,
    FetchmovementTypesController,
    UpdateInstitutionController,
    UpdatePathologyController,
    UpdateTherapeuticClassController,
    UpdatePharmaceuticalFormController,
    UpdateManufacturerController,
    UpdateUnitMeasureController,
    UpdateOperatorController,

  ],
  providers: [
    AuthenticateOperatorUseCase,
    GetOperatorDetailsUseCase,
    GetInstitutionUseCase,
    GetPathologyUseCase,
    GetTherapeuticClassUseCase,
    GetPharmaceuticalFormUseCase,
    GetManufacturerUseCase,
    GetUnitMeasureUseCase,
    GetOperatorUseCase,
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
    CreatePatientUseCase,
    CreateMovementTypeUseCase,
    DispensationMedicineUseCase,
    RegisterMedicineEntryUseCase,
    FethOperatorsUseCase,
    FethInstitutionsUseCase,
    FetchStocksUseCase,
    FetchTherapeuticClassesUseCase,
    FetchPharmaceuticalFormsUseCase,
    FetchManufacturersUseCase,
    FetchUnitsMeasureUseCase,
    FetchPathologiesUseCase,
    FetchMedicinesUseCase,
    FetchMedicinesVariantsUseCase,
    FetchRegisterMedicinesEntriesUseCase,
    FetchBatchesUseCase,
    FetchPatientsUseCase,
    FetchDispensationsUseCase,
    FetchBatchesStockUseCase,
    FetchMedicinesStockUseCase,
    FetchMovementTypesUseCase,
    UpdateInstitutionUseCase,
    UpdatePathologyUseCase,
    UpdateTherapeuticClassUseCase,
    UpdatePharmaceuticalFormUseCase,
    UpdateManufacturerUseCase,
    UpdateUnitMeasureUseCase,
    UpdateOperatorUseCase,
  ],
})
export class HttpModule {}
