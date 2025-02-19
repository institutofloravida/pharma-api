import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvModule } from '@/infra/env/env.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { compare, hash } from 'bcryptjs'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { OperatorFactory } from 'test/factories/make-operator'
describe('Update Operator (E2E)', () => {
  let app: INestApplication
  let institutionFactory: InstitutionFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [
        OperatorFactory,
        OperatorFactory,
        InstitutionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)

    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /operator/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const institution = await institutionFactory.makePrismaInstitution()
    const institution2 = await institutionFactory.makePrismaInstitution()

    const operator = await operatorFactory.makePrismaOperator({
      name: 'Carlos Augustus',
      email: 'carlosaugustus@gmail.com',
      institutionsIds: [institution.id],
      role: 'COMMON',
      passwordHash: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .put(`/operator/${operator.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Carlos Augustus Segundo',
        email: 'carlosaugustus2@gmail.com',
        institutionsIds: [
          institution.id.toString(),
          institution2.id.toString(),
        ],
        role: 'MANAGER',
        password: '12345678',
      })

    expect(response.statusCode).toBe(204)

    const operatorOnDataBase = await prisma.operator.findUnique({
      where: {
        id: operator.id.toString(),
      },
      include: {
        institutions: {
          select: {
            id: true,
          },
        },
      },
    })
    expect(operatorOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Carlos Augustus Segundo',
        email: 'carlosaugustus2@gmail.com',
        role: 'MANAGER',
        institutions: expect.arrayContaining([
          expect.objectContaining({ id: institution.id.toString() }),
          expect.objectContaining({ id: institution2.id.toString() }),
        ]),
      }),
    )
    const passwordIsValid = await compare(
      '12345678',
      operatorOnDataBase?.passwordHash ?? '',
    )
    expect(passwordIsValid).toBeTruthy()
  })
})
