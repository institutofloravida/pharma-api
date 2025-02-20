import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvModule } from '@/infra/env/env.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
// import { OperatorRole } from '@prisma/client'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
describe('Validate Token (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let operatorFactory: OperatorFactory
  let institutionFactory: InstitutionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [InstitutionFactory, OperatorFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    operatorFactory = moduleRef.get(OperatorFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    await app.init()
  })

  test('[GET] /validate-token', async () => {
    const institution = await institutionFactory.makePrismaInstitution()
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: operator.id.toString(), role: operator.role })
    const createOperator = await request(app.getHttpServer()).post('/accounts').set('Authorization', `Bearer ${accessToken}`).send({
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

    const authenticateOperator = await request(app.getHttpServer()).post('/sessions').set('Authorization', `Bearer ${accessToken}`).send({
      email: 'john@gmail.com',
      password: '123456',
    })

    expect(authenticateOperator.body.access_token).toBeTruthy()

    const tokenValidate = await request(app.getHttpServer()).get('/validate-token')
      .set('Authorization', `Bearer ${authenticateOperator.body.access_token}`)

    expect(tokenValidate.statusCode).toBe(200)
  })
})
