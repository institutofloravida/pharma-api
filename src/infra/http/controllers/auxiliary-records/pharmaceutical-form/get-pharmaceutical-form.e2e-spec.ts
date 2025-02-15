import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'

describe('Get Pathology (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PharmaceuticalFormFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /pharmaceutical-form/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'COMMON',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const pharmaceuticalForm = await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()

    const response = await request(app.getHttpServer())
      .get(`/pharmaceutical-form/${pharmaceuticalForm.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        pharmaceutical_form: expect.objectContaining({
          name: pharmaceuticalForm.content,
        }),
      }),
    )
  })
})
