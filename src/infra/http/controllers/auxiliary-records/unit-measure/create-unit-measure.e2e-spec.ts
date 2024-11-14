import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Create Unit measure (E2E)', () => {
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

  test('[POST] /unit-measure', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const response = await request(app.getHttpServer()).post('/unit-measure')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'unit measure test',
        acronym: 'cx',
      })

    expect(response.statusCode).toBe(201)

    const unitMeasureOnDataBase = await prisma.unitMeasure.findFirst({
      where: {
        name: 'unit measure test',
      },
    })

    expect(unitMeasureOnDataBase).toBeTruthy()
  })
})
