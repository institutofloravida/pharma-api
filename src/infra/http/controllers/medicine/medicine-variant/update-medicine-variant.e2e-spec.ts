import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'
describe('Update Medicine Variant (E2E)', () => {
  let app: INestApplication
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let medicineFactory: MedicineFactory
  let operatorFactory: OperatorFactory
  let medicineVariantFactory: MedicineVariantFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        MedicineVariantFactory,
        TherapeuticClassFactory,
        UnitMeasureFactory,
        PharmaceuticalFormFactory,
        MedicineFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /medicine-variant/:id', async () => {
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    })

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'losartana',
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure({
      acronym: 'mg',
    })

    const unitMeasure2 = await unitMeasureFactory.makePrismaUnitMeasure({
      acronym: 'mcg',
    })

    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()

    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
        complement: 'CX',
      })

    const response = await request(app.getHttpServer())
      .put(`/medicinevariant/${medicineVariant.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        dosage: '400',
        unitMeasureId: unitMeasure2.id.toString(),
        complement: 'CP',
      })

    expect(response.statusCode).toBe(204)

    const medicinevariantOnDataBase = await prisma.medicineVariant.findUnique({
      where: {
        id: medicineVariant.id.toString(),
      },
    })

    expect(medicinevariantOnDataBase).toEqual(
      expect.objectContaining({
        dosage: '400',
        unitMeasureId: unitMeasure2.id.toString(),
        complement: 'CP',
      }),
    )
  })
})
