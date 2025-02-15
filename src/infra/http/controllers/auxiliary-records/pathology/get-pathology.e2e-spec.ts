import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PathologyFactory } from 'test/factories/make-pathology'

describe('Get Pathology (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pathologyFactory: PathologyFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PathologyFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pathologyFactory = moduleRef.get(PathologyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /pathology/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const pathology = await pathologyFactory.makePrismaPathology({
      content: 'ASMA',
    })

    const response = await request(app.getHttpServer())
      .get(`/pathology/${pathology.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        pathology: expect.objectContaining({
          name: 'ASMA',
        }),
      }),
    )
  })
})
