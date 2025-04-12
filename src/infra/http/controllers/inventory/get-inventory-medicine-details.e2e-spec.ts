import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { MedicineFactory } from 'test/factories/make-medicine'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'
import { BatchStockFactory } from 'test/factories/make-batch-stock'
import { MedicineStockFactory } from 'test/factories/make-medicine-stock'
import { StockFactory } from 'test/factories/make-stock'
import { BatchFactory } from 'test/factories/make-batch'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

describe('Get Inventory Medicine Details (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineVariantFactory: MedicineVariantFactory
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let stockFactory: StockFactory
  let medicineStockFactory: MedicineStockFactory
  let batchStockFactory: BatchStockFactory
  let batchFactory: BatchFactory
  let manufacturerFactory: ManufacturerFactory
  let jwt: JwtService

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        InstitutionFactory,
        ManufacturerFactory,
        MedicineFactory,
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineVariantFactory,
        BatchStockFactory,
        UnitMeasureFactory,
        PharmaceuticalFormFactory,
        MedicineStockFactory,
        StockFactory,
        BatchFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    medicineStockFactory = moduleRef.get(MedicineStockFactory)
    stockFactory = moduleRef.get(StockFactory)
    batchFactory = moduleRef.get(BatchFactory)
    batchStockFactory = moduleRef.get(BatchStockFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /inventory/:medicineStockId', async () => {
    const date = new Date(2025, 0, 1)
    vi.setSystemTime(date)

    const institution = await institutionFactory.makePrismaInstitution()

    const manufacturer = await manufacturerFactory.makePrismaManufacturer()

    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    })

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()

    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'Dipirona',
      therapeuticClassesIds: [therapeuticClass.id],
    })

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()

    const pharmaceuticalForm = await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({
      content: 'comp',
    })

    const medicineVariant = await medicineVariantFactory.makePrismaMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
      dosage: '500',
    })

    const medicineStock = await medicineStockFactory.makePrismaMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 20,
      minimumLevel: 10,
    })

    const batch = await batchFactory.makePrismaBatch({
      manufacturerId: manufacturer.id,
      code: 'ABC01',
      expirationDate: new Date(2000, 5, 31),
    })

    await batchStockFactory.makePrismaBatchStock({
      batchId: batch.id,
      medicineStockId: medicineStock.id,
      stockId: stock.id,
      currentQuantity: 20,
      medicineVariantId: medicineVariant.id,
    })

    vi.setSystemTime(new Date(2025, 5, 5))
    const response = await request(app.getHttpServer())
      .get(`/inventory/${medicineStock.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        inventory:
          expect.objectContaining({
            totalQuantity: 20,
            medicine: 'Dipirona',
          }),
      }),
    )
  })
})
