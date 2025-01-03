import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Fetch Manufacturers (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let manufacturerFactory: ManufacturerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManufacturerFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /manufacturers', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      manufacturerFactory.makePrismaManufacturer({
        content: 'manufacturer 1',
      }),
      manufacturerFactory.makePrismaManufacturer({
        content: 'manufacturer 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/manufacturer')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()

    console.log(response.error)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        manufacturers: expect.arrayContaining([
          expect.objectContaining({ name: 'manufacturer 1' }),
          expect.objectContaining({ name: 'manufacturer 2' }),
        ]),
      }),
    )
  })
})
