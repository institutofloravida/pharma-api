import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PatientFactory } from 'test/factories/make-patient'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { MedicineExitFactory } from 'test/factories/make-medicine-exit'
import { BatchFactory } from 'test/factories/make-batch'
import { BatchStockFactory } from 'test/factories/make-batch-stock'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineStockFactory } from 'test/factories/make-medicine-stock'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { StockFactory } from 'test/factories/make-stock'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { DispensationFactory } from 'test/factories/make-dispensation'
import { AddressFactory } from 'test/factories/make-address'
import { addDays } from 'date-fns'

describe('Fetch Dispenses Per Day (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let medicineExitFactory: MedicineExitFactory
  let manufacturerFactory: ManufacturerFactory
  let institutionFactory: InstitutionFactory
  let stockFactory: StockFactory
  let batchFactory: BatchFactory
  let batchStockFactory: BatchStockFactory
  let medicineStockFactory: MedicineStockFactory
  let medicineVariantFactory: MedicineVariantFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineFactory: MedicineFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let dispensationFactory: DispensationFactory
  let addressFactory: AddressFactory
  let patientFactory: PatientFactory
  let prisma: PrismaService

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MedicineExitFactory,
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        InstitutionFactory,
        MedicineVariantFactory,
        StockFactory,
        PatientFactory,
        BatchStockFactory,
        BatchFactory,
        MedicineStockFactory,
        ManufacturerFactory,
        DispensationFactory,
        AddressFactory,
        PatientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    medicineExitFactory = moduleRef.get(MedicineExitFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    batchFactory = moduleRef.get(BatchFactory)
    batchStockFactory = moduleRef.get(BatchStockFactory)
    medicineStockFactory = moduleRef.get(MedicineStockFactory)
    stockFactory = moduleRef.get(StockFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    dispensationFactory = moduleRef.get(DispensationFactory)
    addressFactory = moduleRef.get(AddressFactory)
    patientFactory = moduleRef.get(PatientFactory)
    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /charts/dispenses-per-day', async () => {
    const institution = await institutionFactory.makePrismaInstitution()
    const manufacturer = await manufacturerFactory.makePrismaManufacturer()
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    })

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    })

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()
    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
      })

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const batch = await batchFactory.makePrismaBatch({
      manufacturerId: manufacturer.id,
    })
    const batch2 = await batchFactory.makePrismaBatch({
      manufacturerId: manufacturer.id,
    })

    const medicineStock = await medicineStockFactory.makePrismaMedicineStock({
      batchesStockIds: [],
      currentQuantity: 50,
      stockId: stock.id,
      medicineVariantId: medicineVariant.id,
    })

    const batchStock = await batchStockFactory.makePrismaBatchStock({
      batchId: batch.id,
      currentQuantity: 40,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batchStock2 = await batchStockFactory.makePrismaBatchStock({
      batchId: batch2.id,
      currentQuantity: 10,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    await prisma.medicineStock.update({
      where: {
        id: medicineStock.id.toString(),
      },
      data: {
        batchesStocks: {
          connect: [
            { id: batchStock.id.toString() },
            { id: batchStock2.id.toString() },
          ],
        },
      },
    })

    const address = await addressFactory.makePrismaAddress()

    const patient = await patientFactory.makePrismaPatient({
      addressId: address.id,
    })

    const [dispensation1, dispensation2, dispensation3] = await Promise.all([
      dispensationFactory.makePrismaDispensation({
        dispensationDate: new Date(2025, 0, 1),
        patientId: patient.id,
        operatorId: operator.id,
      }),
      dispensationFactory.makePrismaDispensation({
        dispensationDate: addDays(new Date(2025, 0, 1), 1),
        patientId: patient.id,
        operatorId: operator.id,
      }),
      dispensationFactory.makePrismaDispensation({
        dispensationDate: addDays(new Date(2025, 0, 1), 1),
        patientId: patient.id,
        operatorId: operator.id,
      }),
    ])

    await Promise.all([
      medicineExitFactory.makePrismaMedicineExit({
        exitDate: new Date(2025, 0, 1),
        operatorId: operator.id,
        batchestockId: batchStock.id,
        exitType: ExitType.DISPENSATION,
        medicineStockId: medicineStock.id,
        movementTypeId: undefined,
        quantity: 20,

        dispensationId: dispensation1.id,

      }),
      medicineExitFactory.makePrismaMedicineExit({
        exitDate: new Date(2025, 0, 2),
        operatorId: operator.id,
        batchestockId: batchStock2.id,
        exitType: ExitType.DISPENSATION,
        medicineStockId: medicineStock.id,
        movementTypeId: undefined,
        dispensationId: dispensation2.id,
        quantity: 10,
      }),
      medicineExitFactory.makePrismaMedicineExit({
        exitDate: new Date(2025, 0, 2),
        operatorId: operator.id,
        batchestockId: batchStock2.id,
        exitType: ExitType.DISPENSATION,
        medicineStockId: medicineStock.id,
        movementTypeId: undefined,
        dispensationId: dispensation3.id,
        quantity: 5,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/charts/dispenses-per-day')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        institutionId: institution.id.toString(),
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z',
      })
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.dispenses).toHaveLength(2)
  })
})
