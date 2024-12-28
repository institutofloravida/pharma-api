import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await operatorFactory.makePrismaOperator({
      email: 'john@gmail.com',
      passwordHash: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)

    expect(response.body.access_token).toBeTruthy()
  })
})
