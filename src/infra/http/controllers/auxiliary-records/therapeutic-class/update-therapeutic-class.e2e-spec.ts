import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
describe('Update Therapeutic Class (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let therapeuticclassFactory: TherapeuticClassFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, TherapeuticClassFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    therapeuticclassFactory = moduleRef.get(TherapeuticClassFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /therapeutic-class/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.COMMON,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const therapeuticClass = await therapeuticclassFactory.makePrismaTherapeuticClass({
      content: 'Anti',
    })

    const response = await request(app.getHttpServer())
      .put(`/therapeutic-class/${therapeuticClass.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Anti-coagulante',
      })

    expect(response.statusCode).toBe(204)

    const therapeuticclassOnDataBase = await prisma.therapeuticClass.findUnique({
      where: {
        id: therapeuticClass.id.toString(),
      },
    })

    expect(therapeuticclassOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Anti-coagulante',
      }),
    )
  })
})
