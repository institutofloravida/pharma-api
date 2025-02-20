import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'

describe('Fetch Pharmaceutical Forms (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PharmaceuticalFormFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /pharmaceutical-form', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({
        content: 'pharmaceutical form 1',
      }),
      pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({
        content: 'pharmaceutical form 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/pharmaceutical-form')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      pharmaceutical_forms: expect.arrayContaining([
        expect.objectContaining({ name: 'pharmaceutical form 1' }),
        expect.objectContaining({ name: 'pharmaceutical form 2' }),
      ]),
    }))
  })
})
