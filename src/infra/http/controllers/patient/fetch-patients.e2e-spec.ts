import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { PatientFactory } from 'test/factories/make-patient'

describe('Fetch Patients (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let patientFactory: PatientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PatientFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    patientFactory = moduleRef.get(PatientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /patients', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      patientFactory.makePrismaPatient({
        birthDate: new Date('2001-01-01'),
        generalRegistration: '019977256',
        cpf: '01234567891',
        sus: '1234567890123456',
        name: 'Francisco Chico Sousa',
      }),
      patientFactory.makePrismaPatient({
        birthDate: new Date('2001-01-01'),
        generalRegistration: '92837465',
        cpf: '09876543210',
        sus: '0987654321098765',
        name: 'Francisco Chico Sousa',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        name: 'Francisco Chico Sousa',
        birthDate: '2001-01-01',
      })
      .send()

    const response2 = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        birthDate: '2001-01-01',
        generalRegistration: '92837465',
        cpf: '09876543210',
        sus: '0987654321098765',
        name: 'Francisco Chico Sousa',
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response2.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        patients: expect.arrayContaining([
          expect.objectContaining({ cpf: '09876543210' }),
          expect.objectContaining({ cpf: '01234567891' }),
        ]),
      }),
    )
    expect(response2.body.patients).toHaveLength(1)
  })
})
