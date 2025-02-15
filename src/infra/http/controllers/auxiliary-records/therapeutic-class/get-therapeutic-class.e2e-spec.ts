import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'

describe('Get Therapeutic Class (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let therapeuticclassFactory: TherapeuticClassFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, TherapeuticClassFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    therapeuticclassFactory = moduleRef.get(TherapeuticClassFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /therapeutic-class/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const therapeuticclass =
      await therapeuticclassFactory.makePrismaTherapeuticClass()

    const response = await request(app.getHttpServer())
      .get(`/therapeutic-class/${therapeuticclass.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        therapeutic_class: expect.objectContaining({
          name: therapeuticclass.content,
          description: therapeuticclass.description,
        }),
      }),
    )
  })
})
