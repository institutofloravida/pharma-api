import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Get MedicineVariant (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineFactory: MedicineFactory
  let medicineVariantFactory: MedicineVariantFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        MedicineVariantFactory,
        UnitMeasureFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /medicine-variant/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'medicine 1',
    })

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure({
      acronym: 'mg',
    })

    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()

    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
      })

    const response = await request(app.getHttpServer())
      .get(`/medicinevariant/${medicineVariant.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        medicinevariant: expect.objectContaining({
          medicineId: medicine.id.toString(),
          medicine: medicine.content,
          dosage: medicineVariant.dosage,
          pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
          pharmaceuticalForm: pharmaceuticalForm.content,
          unitMeasureId: unitMeasure.id.toString(),
          unitMeasure: unitMeasure.acronym,
        }),
      }),
    )
  })
})
