import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
import { StockFactory } from 'test/factories/make-stock'
describe('Update stock (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let operatorFactory: OperatorFactory
  let stockFactory: StockFactory
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /stock/:id', async () => {
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: operator.id.toString(), role: operator.role })

    const institution = await institutionFactory.makePrismaInstitution()

    const stock = await stockFactory.makePrismaStock({
      content: 'Stock 01',
      institutionId: institution.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/stock/${stock.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Stock 02',
      })

    expect(response.statusCode).toBe(204)

    const stockOnDataBase = await prisma.stock.findUnique({
      where: {
        id: stock.id.toString(),
      },
    })

    expect(stockOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Stock 02',
      }),
    )
  })
})
