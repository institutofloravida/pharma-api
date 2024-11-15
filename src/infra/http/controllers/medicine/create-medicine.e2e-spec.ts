import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'

describe('Create Medicine (E2E)', () => {
  let app: INestApplication
  let therapeuticClassFactory: TherapeuticClassFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, TherapeuticClassFactory],
    })
      .compile()

    app = moduleRef.createNestApplication()

    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /medicine', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const therapeuticClass = await therapeuticClassFactory.makePrismaTherapeuticClass()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })
    const response = await request(app.getHttpServer()).post('/medicine')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Dipirona',
        therapeuticClassesIds: [therapeuticClass.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const medicineOnDataBase = await prisma.medicine.findFirst({
      where: {
        name: 'Dipirona',
      },
    })

    expect(medicineOnDataBase).toBeTruthy()
  })
})
