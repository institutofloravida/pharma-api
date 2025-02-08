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
import {
  MedicineStockFactory,
} from 'test/factories/make-medicine-stock'
import { StockFactory } from 'test/factories/make-stock'
import { BatchFactory } from 'test/factories/make-batch'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'

describe('Fetch Batches Stock (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let manufacturerFactory: ManufacturerFactory
  let batchStockFactory: BatchStockFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineVariantFactory: MedicineVariantFactory
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let stockFactory: StockFactory
  let medicineStockFactory: MedicineStockFactory
  let batchFactory: BatchFactory
  let jwt: JwtService

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
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    batchStockFactory = moduleRef.get(BatchStockFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    medicineStockFactory = moduleRef.get(MedicineStockFactory)
    stockFactory = moduleRef.get(StockFactory)
    batchFactory = moduleRef.get(BatchFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /batch-stock', async () => {
    const institution = await institutionFactory.makePrismaInstitution()

    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
      institutionsIds: [institution.id],
    })

    const manufacturer = await manufacturerFactory.makePrismaManufacturer()

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'medicine 1',
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()

    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
      })

    const medicineStock = await medicineStockFactory.makePrismaMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 80,
    })

    const batch = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id })
    const batch2 = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id })

    await Promise.all([
      batchStockFactory.makePrismaBatchStock({
        batchId: batch.id,
        medicineVariantId: medicineVariant.id,
        medicineStockId: medicineStock.id,
        stockId: stock.id,
        currentQuantity: 40,
      }),
      batchStockFactory.makePrismaBatchStock({
        batchId: batch2.id,
        medicineVariantId: medicineVariant.id,
        medicineStockId: medicineStock.id,
        stockId: stock.id,
        currentQuantity: 40,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/batch-stock')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        batches_stock: expect.arrayContaining([
          expect.objectContaining({ quantity: 40 }),
          expect.objectContaining({ quantity: 40 }),
        ]),
      }),
    )
  })
})
