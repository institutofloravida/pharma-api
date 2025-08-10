import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MedicineFactory } from 'test/factories/make-medicine';
import { OperatorFactory } from 'test/factories/make-operator';

describe('Delete Medicine (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let medicineFactory: MedicineFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, MedicineFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    medicineFactory = moduleRef.get(MedicineFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /medicine/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const medicine = await medicineFactory.makePrismaMedicine();

    const response = await request(app.getHttpServer())
      .delete(`/medicine/${medicine.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const medicineOnDataBase = await prisma.medicine.findFirst({
      where: {
        id: medicine.id.toString(),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(medicineOnDataBase).toBeFalsy();
  });
});
