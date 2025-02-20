import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PathologyFactory } from 'test/factories/make-pathology'
describe('Update pathology (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pathologyFactory: PathologyFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PathologyFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    pathologyFactory = moduleRef.get(PathologyFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /pathology/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const pathology = await pathologyFactory.makePrismaPathology({
      content: 'Hipertensão',
    })

    const response = await request(app.getHttpServer())
      .put(`/pathology/${pathology.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hipertensão Arterial',
      })

    expect(response.statusCode).toBe(204)

    const pathologyOnDataBase = await prisma.pathology.findUnique({
      where: {
        id: pathology.id.toString(),
      },
    })

    expect(pathologyOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Hipertensão Arterial',
      }),
    )
  })
})
