import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

describe('Get Manufacturer (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let manufacturerFactory: ManufacturerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, ManufacturerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /manufacturer/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.COMMON,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const manufacturer = await manufacturerFactory.makePrismaManufacturer({
      content: 'ACHÉ',
    })

    const response = await request(app.getHttpServer())
      .get(`/manufacturer/${manufacturer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        manufacturer: expect.objectContaining({
          name: 'ACHÉ',
        }),
      }),
    )
  })
})
