import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Race } from 'prisma/generated'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PathologyFactory } from 'test/factories/make-pathology'

describe('Create Patient (E2E)', () => {
  let app: INestApplication
  let pathologyFactory: PathologyFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PathologyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    pathologyFactory = moduleRef.get(PathologyFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /patient', async () => {
    const patient = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({
      sub: patient.id.toString(),
      role: patient.role,
    })

    const pathology = await pathologyFactory.makePrismaPathology()
    const response = await request(app.getHttpServer())
      .post('/patient')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Francisco',
        cpf: '12345678901',
        sus: 'string',
        birthDate: new Date('2020-01-01'),
        gender: 'M',
        race: Race.MIXED,
        generalRegistration: '1234567',
        addressPatient: {
          street: 'rua do centro',
          number: '123',
          complement: 'perto de alguma coisa',
          neighborhood: 'centro',
          city: 'Parnaíba',
          state: 'PI',
          zipCode: '64208120',
        },
        pathologiesIds: [pathology.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const patientOnDataBase = await prisma.patient.findFirst({
      where: {
        name: 'Francisco',
      },
    })

    const addressOnDatabase = await prisma.address.findFirst({
      where: {
        zipCode: '64208120',
      },
    })

    expect(patientOnDataBase).toBeTruthy()
    expect(addressOnDatabase).toBeTruthy()
  })
})
