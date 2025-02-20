import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Get Operator Details (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /me', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const response = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.operator).toEqual(expect.objectContaining({ email: user.email }))
  })
})
