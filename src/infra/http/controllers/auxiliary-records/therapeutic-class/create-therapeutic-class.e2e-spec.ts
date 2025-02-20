import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'

describe('Create Therapeutic Class (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TherapeuticClassFactory, OperatorFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /therapeuticclasss', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const response = await request(app.getHttpServer()).post('/therapeutic-class')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'therapeutic class test',
        cnpj: '12345678901234',
      })

    expect(response.statusCode).toBe(201)

    const therapeuticclassOnDataBase = await prisma.therapeuticClass.findFirst({
      where: {
        name: 'therapeutic class test',
      },
    })

    expect(therapeuticclassOnDataBase).toBeTruthy()
  })
})
