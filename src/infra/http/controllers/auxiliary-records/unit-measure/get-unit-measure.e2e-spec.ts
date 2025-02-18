import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Get Unit Measure (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let unitmeasureFactory: UnitMeasureFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, UnitMeasureFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    unitmeasureFactory = moduleRef.get(UnitMeasureFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /unit-measure/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'COMMON',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const unitMeasure = await unitmeasureFactory.makePrismaUnitMeasure({
      content: 'miligrama',
      acronym: 'mg',
    })

    const response = await request(app.getHttpServer())
      .get(`/unit-measure/${unitMeasure.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        unit_measure: expect.objectContaining({
          name: 'miligrama',
          acronym: 'mg',
        }),
      }),
    )
  })
})
