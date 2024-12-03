import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'

describe('Fetch Therapeutic Classes (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TherapeuticClassFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /therapeutic-class', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      therapeuticClassFactory.makePrismaTherapeuticClass({
        content: 'therapeutic class 1',
      }),
      therapeuticClassFactory.makePrismaTherapeuticClass({
        content: 'therapeutic class 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/therapeutic-class')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    
    expect(response.body).toEqual({
      therapeutic_classes: expect.arrayContaining([
        expect.objectContaining({ name: 'therapeutic class 1' }),
        expect.objectContaining({ name: 'therapeutic class 2' }),
      ]),
    })
  })
})
