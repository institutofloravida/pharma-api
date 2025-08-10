import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MedicineFactory } from 'test/factories/make-medicine';
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant';
import { OperatorFactory } from 'test/factories/make-operator';
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form';
import { UnitMeasureFactory } from 'test/factories/make-unit-measure';

describe('Delete MedicineVariant (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let medicineVariantFactory: MedicineVariantFactory;
  let medicineFactory: MedicineFactory;
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory;
  let unitMeasureFactory: UnitMeasureFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        MedicineVariantFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    medicineFactory = moduleRef.get(MedicineFactory);
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory);
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /medicine-variant/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const medicine = await medicineFactory.makePrismaMedicine({});
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({});
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure({});
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
      });

    const response = await request(app.getHttpServer())
      .delete(`/medicine-variant/${medicineVariant.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const medicinevariantOnDataBase = await prisma.medicineVariant.findFirst({
      where: {
        id: medicineVariant.id.toString(),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(medicinevariantOnDataBase).toBeFalsy();
  });
});
