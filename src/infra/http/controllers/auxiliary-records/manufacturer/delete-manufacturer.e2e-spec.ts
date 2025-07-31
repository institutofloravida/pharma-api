import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Delete Manufacturer (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let manufacturerFactory: ManufacturerFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, ManufacturerFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[DELETE] /manufacturer/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const manufacturer = await manufacturerFactory.makePrismaManufacturer()

    const response = await request(app.getHttpServer()).delete(`/manufacturer/${manufacturer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const manufacturerOnDataBase = await prisma.manufacturer.findFirst({
      where: {
        id: manufacturer.id.toString(),
      },
    })

    expect(response.statusCode).toBe(200)
    expect(manufacturerOnDataBase).toBeFalsy()
  })
})
