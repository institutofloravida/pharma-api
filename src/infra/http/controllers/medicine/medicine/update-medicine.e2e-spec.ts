import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { MedicineFactory } from 'test/factories/make-medicine'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
describe('Update medicine (E2E)', () => {
  let app: INestApplication
  let therapeuticClassFactory: TherapeuticClassFactory
  let operatorFactory: OperatorFactory
  let medicineFactory: MedicineFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, MedicineFactory, TherapeuticClassFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /medicine/:id', async () => {
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    })

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    })

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()

    const therapeuticClass2 =
      await therapeuticClassFactory.makePrismaTherapeuticClass()

    const medicine = await medicineFactory.makePrismaMedicine({
      content: 'Losartan',
      therapeuticClassesIds: [therapeuticClass.id],
    })

    const response = await request(app.getHttpServer())
      .put(`/medicine/${medicine.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Losartana',
        description: 'para hipertensão',
        therapeuticClassesIds: [
          therapeuticClass.id.toString(),
          therapeuticClass2.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(204)

    const medicineOnDataBase = await prisma.medicine.findUnique({
      where: {
        id: medicine.id.toString(),
      },
      include: {
        therapeuticClasses: true,
      },
    })

    expect(medicineOnDataBase).toEqual(
      expect.objectContaining({
        name: 'Losartana',
        description: 'para hipertensão',
        therapeuticClasses: expect.arrayContaining([
          expect.objectContaining({
            id: therapeuticClass.id.toString(),
          }),
          expect.objectContaining({
            id: therapeuticClass2.id.toString(),
          }),
        ]),
      }),
    )
  })
})
