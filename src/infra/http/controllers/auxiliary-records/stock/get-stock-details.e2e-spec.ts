import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
import { StockFactory } from 'test/factories/make-stock'

describe('Get Stock (E2E)', () => {
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

  test('[GET] /stock/:id', async () => {
    const institution = await institutionFactory.makePrismaInstitution()

    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const stock = await stockFactory.makePrismaStock({
      content: 'Stock 01',
      institutionId: institution.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/stock/${stock.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        stock: expect.objectContaining({
          name: 'Stock 01',
          status: true,
          institutionName: institution.content,
          institutionId: institution.id.toString(),
        }),
      }),
    )
  })
})
