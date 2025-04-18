import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Fetch institutions (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let institutionFactory: InstitutionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, InstitutionFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /institutions', async () => {
    const [institution1, institution2] = await Promise.all([
      institutionFactory.makePrismaInstitution({
        cnpj: '12345678901234',
      }),
      institutionFactory.makePrismaInstitution({
        cnpj: '12345678912345',
      }),
    ])

    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
      institutionsIds: [institution1.id, institution2.id],
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const response = await request(app.getHttpServer())
      .get('/institutions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        cnpj: '12345678912345',
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        institutions: expect.arrayContaining([
          expect.objectContaining({ cnpj: '12345678912345' }),
        ]),
      }),
    )
  })
})
