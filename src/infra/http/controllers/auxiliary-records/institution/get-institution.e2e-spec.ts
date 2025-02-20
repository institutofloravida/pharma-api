import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Get Institution (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let institutionFactory: InstitutionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, InstitutionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /institution/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const institution = await institutionFactory.makePrismaInstitution({
      cnpj: '12345678901234',
    })

    const response = await request(app.getHttpServer())
      .get(`/institution/${institution.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        institution: expect.objectContaining({
          cnpj: '12345678901234',
        }),
      }),
    )
  })
})
