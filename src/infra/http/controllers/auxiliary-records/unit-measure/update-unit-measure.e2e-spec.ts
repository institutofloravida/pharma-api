import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'
describe('Update Unit Measure (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let unitmeasureFactory: UnitMeasureFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, UnitMeasureFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    unitmeasureFactory = moduleRef.get(UnitMeasureFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /unit-measure/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'COMMON',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const unitmeasure = await unitmeasureFactory.makePrismaUnitMeasure({
      content: 'miligram',
      acronym: 'mg',
    })

    const response = await request(app.getHttpServer())
      .put(`/unit-measure/${unitmeasure.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'miligrama',
      })

    expect(response.statusCode).toBe(204)

    const unitmeasureOnDataBase = await prisma.unitMeasure.findUnique({
      where: {
        id: unitmeasure.id.toString(),
      },
    })

    expect(unitmeasureOnDataBase).toEqual(
      expect.objectContaining({
        name: 'miligrama',
      }),
    )
  })
})
