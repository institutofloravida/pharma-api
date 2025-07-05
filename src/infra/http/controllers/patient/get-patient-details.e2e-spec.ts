import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { OperatorFactory } from 'test/factories/make-operator'
import { PathologyFactory } from 'test/factories/make-pathology'
import { PatientFactory } from 'test/factories/make-patient'

describe('Get Patient Details (E2E)', () => {
  let app: INestApplication
  let pathologyFactory: PathologyFactory
  let operatorFactory: OperatorFactory
  let addressFactory: AddressFactory
  let patientFactory: PatientFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PathologyFactory, AddressFactory, PatientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    pathologyFactory = moduleRef.get(PathologyFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    addressFactory = moduleRef.get(AddressFactory)
    patientFactory = moduleRef.get(PatientFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /patient/:id', async () => {
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    })

    const pathology = await pathologyFactory.makePrismaPathology()

    const address1 = await addressFactory.makePrismaAddress({
      street: 'rua do centro',
      number: '123',
      complement: 'perto de alguma coisa',
      neighborhood: 'centro',
      city: 'Parnaíba',
      state: 'PI',
      zipCode: '64208120',
    })

    const patient = await patientFactory.makePrismaPatient({
      birthDate: new Date('2001-01-01'),
      generalRegistration: '019977256',
      cpf: '01234567891',
      gender: 'M',
      pathologiesIds: [pathology.id],
      race: 'MIXED',
      addressId: address1.id,
      sus: '1234567890123456',
      name: 'Francisco Chico Sousa',
    })
    const response = await request(app.getHttpServer())
      .get(`/patient/${patient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.patient).toEqual(expect.objectContaining({
      name: 'Francisco Chico Sousa',
      generalRegistration: '019977256',
      cpf: '01234567891',
      gender: 'M',
      race: 'MIXED',
      sus: '1234567890123456',
      address: expect.objectContaining({
        street: 'rua do centro',
        number: '123',
        complement: 'perto de alguma coisa',
        neighborhood: 'centro',
        city: 'Parnaíba',
        state: 'PI',
        zipCode: '64208120',
      }),
    }))
  })
})
