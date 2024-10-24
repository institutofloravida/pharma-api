import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'john all',
      email: 'john@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const operatorOnDataBase = await prisma.operator.findUnique({
      where: {
        email: 'john@gmail.com',
      },
    })

    expect(operatorOnDataBase).toBeTruthy()
  })
})
