import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

describe('Fetch Operators (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let operatorFactory: OperatorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, InstitutionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)

    operatorFactory = moduleRef.get(OperatorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /operator', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const institution = await institutionFactory.makePrismaInstitution()
    const institution2 = await institutionFactory.makePrismaInstitution()

    await Promise.all([
      operatorFactory.makePrismaOperator({
        name: 'joão',
        institutionsIds: [institution.id],
      }),
      operatorFactory.makePrismaOperator({
        role: OperatorRole.MANAGER,
        name: 'maria',
        institutionsIds: [institution2.id],
        email: 'maria@gamil.com',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/operator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        institutionId: institution2.id.toString(),
        name: 'ma',
        email: 'maria@gamil.com',
        role: OperatorRole.MANAGER,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        operators: expect.arrayContaining([
          expect.objectContaining({ name: 'maria' }),
        ]),
      }),
    )
  })
})
