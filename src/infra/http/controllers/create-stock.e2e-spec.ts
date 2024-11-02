import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
describe('Create Stock (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, InstitutionFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test.only('[POST] /stocks', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'ADMIN',
    })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const institution = await institutionFactory.makePrismaInstitution({})

    const response = await request(app.getHttpServer()).post('/stocks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'stock test',
        institutionId: institution.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const stockOnDataBase = await prisma.stock.findFirst({
      where: {
        name: 'stock test',
      },
    })

    expect(stockOnDataBase).toBeTruthy()
  })
})
