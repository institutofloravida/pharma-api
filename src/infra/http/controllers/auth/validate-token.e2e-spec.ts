import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { OperatorRole } from '@prisma/client'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
describe('Validate Token (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let institutionFactory: InstitutionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [InstitutionFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    institutionFactory = moduleRef.get(InstitutionFactory)
    await app.init()
  })

  test('[GET] /validate-token', async () => {
    const institution = await institutionFactory.makePrismaInstitution()
    const createOperator = await request(app.getHttpServer()).post('/accounts').send({
      name: 'john all',
      email: 'john@gmail.com',
      password: '123456',
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id.toString()],
    })

    expect(createOperator.statusCode).toBe(201)

    const operatorOnDataBase = await prisma.operator.findUnique({
      where: {
        email: 'john@gmail.com',
      },
    })

    expect(operatorOnDataBase).toBeTruthy()

    const authenticateOperator = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@gmail.com',
      password: '123456',
    })

    expect(authenticateOperator.body.access_token).toBeTruthy()

    const tokenValidate = await request(app.getHttpServer()).get('/validate-token')
      .set('Authorization', `Bearer ${authenticateOperator.body.access_token}`)

    expect(tokenValidate.statusCode).toBe(200)
  })
})
