import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { OperatorRole } from '@prisma/client'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let institutionFactory: InstitutionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [InstitutionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    institutionFactory = moduleRef.get(InstitutionFactory)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const institution = await institutionFactory.makePrismaInstitution()

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'john all',
        email: 'john@gmail.com',
        password: '123456',
        role: OperatorRole.MANAGER,
        institutionsIds: [institution.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const operatorOnDataBase = await prisma.operator.findUnique({
      where: {
        email: 'john@gmail.com',
      },
    })

    expect(operatorOnDataBase).toBeTruthy()
  })
})
