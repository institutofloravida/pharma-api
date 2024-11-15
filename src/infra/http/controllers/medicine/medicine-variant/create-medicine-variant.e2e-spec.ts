import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { MedicineFactory } from 'test/factories/make-medicine'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Create Medicine-Variant (E2E)', () => {
  let app: INestApplication
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineFactory: MedicineFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, TherapeuticClassFactory, MedicineFactory, PharmaceuticalFormFactory, UnitMeasureFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()

    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /medicine-variant', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()
    const pharmaceuticalForm = await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()
    const therapeuticClass = await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const response = await request(app.getHttpServer()).post('/medicine-variant')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        medicineId: medicine.id.toString(),
        dosage: '500',
        pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
        unitMeasureId: unitMeasure.id.toString(),

      })

    expect(response.statusCode).toBe(201)

    const medicineVariantOnDataBase = await prisma.medicineVariant.findFirst({
      where: {
        dosage: '500',
        pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
      },
    })

    expect(medicineVariantOnDataBase).toBeTruthy()
  })
})
