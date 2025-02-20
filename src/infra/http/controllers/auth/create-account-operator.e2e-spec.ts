import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvModule } from '@/infra/env/env.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
describe('Create account (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let operatorFactory: OperatorFactory
  let institutionFactory: InstitutionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [InstitutionFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    operatorFactory = moduleRef.get(OperatorFactory)

    institutionFactory = moduleRef.get(InstitutionFactory)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const institution = await institutionFactory.makePrismaInstitution()
    const operator = await operatorFactory.makePrismaOperator({
      institutionsIds: [institution.id],
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: operator.id.toString(), role: operator.role })

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
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
