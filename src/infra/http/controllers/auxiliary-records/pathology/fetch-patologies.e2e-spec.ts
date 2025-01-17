import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PathologyFactory } from 'test/factories/make-pathology'

describe('Fetch Pathologies (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pathologyFactory: PathologyFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PathologyFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pathologyFactory = moduleRef.get(PathologyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /pathologies', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      pathologyFactory.makePrismaPathology({
        content: 'pathology 1',
      }),
      pathologyFactory.makePrismaPathology({
        content: 'pathology 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/pathologies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        content: 'patho',
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      pathologies: expect.arrayContaining([
        expect.objectContaining({ name: 'pathology 1' }),
        expect.objectContaining({ name: 'pathology 2' }),
      ]),
    })
  })
})
