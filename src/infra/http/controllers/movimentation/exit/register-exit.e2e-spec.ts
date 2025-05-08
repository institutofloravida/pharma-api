import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BatchFactory } from 'test/factories/make-batch'
import { BatchStockFactory } from 'test/factories/make-batch-stock'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineStockFactory } from 'test/factories/make-medicine-stock'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { MovementTypeFactory } from 'test/factories/make-movement-type'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { StockFactory } from 'test/factories/make-stock'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Register Medicine Exit (E2E)', () => {
  let app: INestApplication
  let batchFactory: BatchFactory
  let batchStockFactory: BatchStockFactory
  let medicineStockFactory: MedicineStockFactory
  let manufacturerFactory: ManufacturerFactory
  let institutionFactory: InstitutionFactory
  let stockFactory: StockFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineVariantFactory: MedicineVariantFactory
  let movementTypeFactory: MovementTypeFactory
  let medicineFactory: MedicineFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        MedicineFactory,
        InstitutionFactory,
        TherapeuticClassFactory,
        MedicineVariantFactory,
        StockFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        MedicineStockFactory,
        MovementTypeFactory,
        ManufacturerFactory,
        MedicineStockFactory,
        BatchStockFactory,
        BatchFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    batchFactory = moduleRef.get(BatchFactory)
    batchStockFactory = moduleRef.get(BatchStockFactory)
    medicineStockFactory = moduleRef.get(MedicineStockFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    stockFactory = moduleRef.get(StockFactory)
    movementTypeFactory = moduleRef.get(MovementTypeFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /medicine/exit', async () => {
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
    const medicineVariant = await medicineVariantFactory.makePrismaMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const batch = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id, code: 'ABC01' })
    const batch2 = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id, code: 'ABC02' })

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
    const movementType = await movementTypeFactory.makePrismaMovementType({
      content: 'DONATION',
      direction: 'EXIT',
    })

    const response = await request(app.getHttpServer())
      .post('/medicine/exit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        medicineStockId: medicineStock.id.toString(),
        batcheStockId: batchStock.id.toString(),
        quantity: 30,
        movementTypeId: movementType.id.toString(),
        exitType: ExitType.MOVEMENT_TYPE,
      })

    expect(response.statusCode).toBe(201)

    const [
      medicineExitOnDatabase,
      quantityOnMedicineStock,
      quantityOnBatchStock1,
      quantityOnBatchStock2,
    ] = await prisma.$transaction([
      prisma.exit.findFirst(),
      prisma.medicineStock.findFirst(),
      prisma.batcheStock.findFirst({
        where: {
          batch: {
            code: 'ABC01',
          },
        },
      }),
      prisma.batcheStock.findFirst({
        where: {
          batch: {
            code: 'ABC01',
          },
        },
      }),
    ])

    expect(medicineExitOnDatabase).toBeTruthy()
    expect(quantityOnMedicineStock?.currentQuantity).toEqual(20)
    expect(quantityOnBatchStock1?.currentQuantity).toEqual(10)
    expect(quantityOnBatchStock2?.currentQuantity).toEqual(10)
  })
})
