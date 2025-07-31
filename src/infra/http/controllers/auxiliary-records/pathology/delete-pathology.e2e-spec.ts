import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PathologyFactory } from 'test/factories/make-pathology'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Delete Pathology (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let pathologyFactory: PathologyFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PathologyFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()
    pathologyFactory = moduleRef.get(PathologyFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[DELETE] /pathology/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const pathology = await pathologyFactory.makePrismaPathology()

    const response = await request(app.getHttpServer()).delete(`/pathology/${pathology.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const pathologyOnDataBase = await prisma.pathology.findFirst({
      where: {
        id: pathology.id.toString(),
      },
    })

    expect(response.statusCode).toBe(200)
    expect(pathologyOnDataBase).toBeFalsy()
  })
})
