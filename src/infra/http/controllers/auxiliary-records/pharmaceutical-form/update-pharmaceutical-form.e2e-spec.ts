import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
describe('Update Pharmaceutical Form (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pharmaceuticalformFactory: PharmaceuticalFormFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PharmaceuticalFormFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pharmaceuticalformFactory = moduleRef.get(PharmaceuticalFormFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /pharmaceutical-form/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.COMMON,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const pharmaceuticalform =
      await pharmaceuticalformFactory.makePrismaPharmaceuticalForm({
        content: 'Comprimido',
      })

    const response = await request(app.getHttpServer())
      .put(`/pharmaceutical-form/${pharmaceuticalform.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Comprimido',
      })

    expect(response.statusCode).toBe(204)

    const pharmaceuticalformOnDataBase =
      await prisma.pharmaceuticalForm.findUnique({
        where: {
          id: pharmaceuticalform.id.toString(),
        },
      })

    expect(pharmaceuticalformOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Comprimido',
      }),
    )
  })
})
