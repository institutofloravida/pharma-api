import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'
import { OperatorFactory } from 'test/factories/make-operator'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

describe('Fetch Units Measure (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let unitMeasureFactory: UnitMeasureFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UnitMeasureFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /unit-measure', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      unitMeasureFactory.makePrismaUnitMeasure({
        content: 'box',
        acronym: 'bx',
      }),
      unitMeasureFactory.makePrismaUnitMeasure({
        content: 'bottle',
        acronym: 'bt',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/unit-measure')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        units_measure: expect.arrayContaining([
          expect.objectContaining({ name: 'box' }),
          expect.objectContaining({ name: 'bottle' }),
        ]),
      }),
    )
  })
})
