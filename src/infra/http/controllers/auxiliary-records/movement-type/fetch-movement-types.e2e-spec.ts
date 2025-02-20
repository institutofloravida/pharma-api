import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { MovementTypeFactory } from 'test/factories/make-movement-type'
import { OperatorFactory } from 'test/factories/make-operator'

describe('Fetch Movement Types (E2E)', () => {
  let app: INestApplication
  let operatorFactory: OperatorFactory
  let movementTypeFactory: MovementTypeFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MovementTypeFactory, OperatorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    operatorFactory = moduleRef.get(OperatorFactory)
    movementTypeFactory = moduleRef.get(MovementTypeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /movement-type', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await Promise.all([
      movementTypeFactory.makePrismaMovementType({
        content: 'movement entry 1',
        direction: 'ENTRY',
      }),
      movementTypeFactory.makePrismaMovementType({
        content: 'movement entry 2',
        direction: 'ENTRY',

      }),
      movementTypeFactory.makePrismaMovementType({
        content: 'movement exit 1',
        direction: 'EXIT',

      }),
      movementTypeFactory.makePrismaMovementType({
        content: 'movement exit 2',
        direction: 'EXIT',

      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/movement-type')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        query: 'movement',
        direction: 'ENTRY',
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining(
        {
          movement_types: expect.arrayContaining([
            expect.objectContaining({ name: 'movement entry 1' }),
            expect.objectContaining({ name: 'movement entry 2' }),
          ]),
        },
      ),
    )
  })
})
