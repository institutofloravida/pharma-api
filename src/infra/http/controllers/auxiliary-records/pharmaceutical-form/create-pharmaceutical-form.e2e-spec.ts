import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Create Pharmaceutical form (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /pharmaceutical form', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const response = await request(app.getHttpServer()).post('/pharmaceutical-form')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'pharmaceutical form test',
        cnpj: '12345678901234',
      })

    expect(response.statusCode).toBe(201)

    const pharmaceuticalFormOnDataBase = await prisma.pharmaceuticalForm.findFirst({
      where: {
        name: 'pharmaceutical form test',
      },
    })

    expect(pharmaceuticalFormOnDataBase).toBeTruthy()
  })
})
