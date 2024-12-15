import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BatchFactory } from 'test/factories/make-batch'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Fetch Bacthes (E2E)', () => {
  let app: INestApplication
  let manufacturerFactory: ManufacturerFactory
  let batchFactory: BatchFactory
  let operatorFactory: OperatorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, BatchFactory, ManufacturerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    batchFactory = moduleRef.get(BatchFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /batches', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'SUPER_ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const manufacturer = await manufacturerFactory.makePrismaManufacturer()

    await Promise.all([
      batchFactory.makePrismaBatch({
        code: 'ABCDE1',
        manufacturerId: manufacturer.id,
      }),
      batchFactory.makePrismaBatch({
        code: 'ABCDE2',
        manufacturerId: manufacturer.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/batches')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send()
    console.log(response.error)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        batches: expect.arrayContaining([
          expect.objectContaining({ code: 'ABCDE1' }),
          expect.objectContaining({ code: 'ABCDE2' }),
        ]),
      }),
    )
  })
})
