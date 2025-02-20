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
describe('Update institution (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let institutionFactory: InstitutionFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, InstitutionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    institutionFactory = moduleRef.get(InstitutionFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /institution/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.SUPER_ADMIN,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const institution = await institutionFactory.makePrismaInstitution({
      cnpj: '12345678901234',
      content: 'Instituto Flora Vida',
    })

    const response = await request(app.getHttpServer())
      .put(`/institution/${institution.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Instituto Flora',
        cnpj: '12345678901235',
        description: 'Institutição com mais de 25 anos!',
      })

    expect(response.statusCode).toBe(204)

    const institutionOnDataBase = await prisma.institution.findUnique({
      where: {
        id: institution.id.toString(),
      },
    })

    expect(institutionOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Instituto Flora',
        cnpj: '12345678901235',
        description: 'Institutição com mais de 25 anos!',
      }),
    )
  })
})
