import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StockFactory } from 'test/factories/make-stock'
import { OperatorFactory } from 'test/factories/make-operator'
import { InstitutionFactory } from 'test/factories/make-insitution'

describe('Fetch stocks (E2E)', () => {
  let app: INestApplication

  let institutionFactory: InstitutionFactory
  let operatorFactory: OperatorFactory
  let stockFactory: StockFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, StockFactory, InstitutionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    stockFactory = moduleRef.get(StockFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /stocks', async () => {
    const insitution = await institutionFactory.makePrismaInstitution()
    const insitution2 = await institutionFactory.makePrismaInstitution()
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
      institutionsIds: [insitution.id],
    })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    await Promise.all([
      stockFactory.makePrismaStock({
        content: 'stock-01',
        institutionId: insitution.id,
      }),
      stockFactory.makePrismaStock({
        content: 'stock-02',
        institutionId: insitution2.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/stocks')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1 })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.stocks).toHaveLength(1)
    expect(response.body).toEqual(
      expect.objectContaining({
        stocks: expect.arrayContaining([
          expect.objectContaining({ name: 'stock-01' }),
        ]),
      }),
    )
  })
})
