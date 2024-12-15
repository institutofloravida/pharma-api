import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { MedicineFactory } from 'test/factories/make-medicine'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'

describe('Fetch Medicines (E2E)', () => {
  let app: INestApplication
  let therapeuticClassFactory: TherapeuticClassFactory
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MedicineFactory, OperatorFactory, TherapeuticClassFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)

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

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()

    await Promise.all([
      medicineFactory.makePrismaMedicine({
        content: 'medicine 1',
        therapeuticClassesIds: [therapeuticClass.id],
      }),
      medicineFactory.makePrismaMedicine({
        content: 'medicine 2',
        therapeuticClassesIds: [],
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/medicines')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        medicines: expect.arrayContaining([
          expect.objectContaining({ name: 'medicine 1' }),
          expect.objectContaining({ name: 'medicine 2' }),
        ]),
      }),
    )
  })
})
