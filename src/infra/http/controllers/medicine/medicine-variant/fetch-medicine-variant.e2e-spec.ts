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

describe('Fetch Medicines (E2E)', () => {
  let app: INestApplication

  let therapeuticClassFactory: TherapeuticClassFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineVariantFactory: MedicineVariantFactory
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MedicineFactory, OperatorFactory, TherapeuticClassFactory, MedicineVariantFactory, UnitMeasureFactory, PharmaceuticalFormFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)

    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /medicines', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const therapeuticClass = await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'medicine 1',
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure({
      acronym: 'mg',
    })
    const unitMeasure2 = await unitMeasureFactory.makePrismaUnitMeasure({
      acronym: 'g',
    })
    const pharmaceuticalForm = await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()

    await Promise.all([
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
      }),
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure2.id,
        dosage: '1',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/medicines-variants')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        medicines_variants: expect.arrayContaining([
          expect.objectContaining({ dosage: '500' }),
          expect.objectContaining({ dosage: '1' }),
        ]),
      }))
  })
})
