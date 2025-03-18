import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { MedicineFactory } from 'test/factories/make-medicine'

describe('Get Medicine (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, MedicineFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /medicine/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'Metformina',
    })

    const response = await request(app.getHttpServer())
      .get(`/medicine/${medicine.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        medicine: expect.objectContaining({
          name: 'Metformina',
        }),
      }),
    )
  })
})
