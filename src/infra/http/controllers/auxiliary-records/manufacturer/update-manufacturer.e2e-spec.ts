import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
describe('Update Manufacturer (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let manufacturerFactory: ManufacturerFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, ManufacturerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /manufacturer/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'COMMON',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const manufacturer = await manufacturerFactory.makePrismaManufacturer({
      content: 'ACHÉ',
    })

    const response = await request(app.getHttpServer())
      .put(`/manufacturer/${manufacturer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Aché Laboratórios',
      })

    expect(response.statusCode).toBe(204)

    const manufacturerOnDataBase = await prisma.manufacturer.findUnique({
      where: {
        id: manufacturer.id.toString(),
      },
    })

    expect(manufacturerOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Aché Laboratórios',
      }),
    )
  })
})
