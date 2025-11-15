import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { MedicineFactory } from 'test/factories/make-medicine';
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class';
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant';
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form';
import { UnitMeasureFactory } from 'test/factories/make-unit-measure';
import { MedicineStockFactory } from 'test/factories/make-medicine-stock';
import { StockFactory } from 'test/factories/make-stock';
import { InstitutionFactory } from 'test/factories/make-insitution';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';

describe('Get Inventory Report (E2E)', () => {
  let app: INestApplication;
  let institutionFactory: InstitutionFactory;
  let therapeuticClassFactory: TherapeuticClassFactory;
  let unitMeasureFactory: UnitMeasureFactory;
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory;
  let medicineVariantFactory: MedicineVariantFactory;
  let operatorFactory: OperatorFactory;
  let medicineFactory: MedicineFactory;
  let stockFactory: StockFactory;
  let medicineStockFactory: MedicineStockFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        InstitutionFactory,
        MedicineFactory,
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineVariantFactory,
        UnitMeasureFactory,
        PharmaceuticalFormFactory,
        MedicineStockFactory,
        StockFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    institutionFactory = moduleRef.get(InstitutionFactory);
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory);
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory);
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory);
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    medicineFactory = moduleRef.get(MedicineFactory);
    medicineStockFactory = moduleRef.get(MedicineStockFactory);
    stockFactory = moduleRef.get(StockFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /reports/inventory', async () => {
    const institution = await institutionFactory.makePrismaInstitution();

    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    });

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass();

    const [medicine1, medicine2] = await Promise.all([
      medicineFactory.makePrismaMedicine({
        content: 'Dipirona',
        therapeuticClassesIds: [therapeuticClass.id],
      }),
      medicineFactory.makePrismaMedicine({
        content: 'Diazepam',
        therapeuticClassesIds: [therapeuticClass.id],
      }),
    ]);

    const [unitMeasure1, unitMeasure2] = await Promise.all([
      unitMeasureFactory.makePrismaUnitMeasure(),
      unitMeasureFactory.makePrismaUnitMeasure(),
    ]);

    const [pharmaceuticalForm1, pharmaceuticalForm2] = await Promise.all([
      pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({
        content: 'comp',
      }),
      pharmaceuticalFormFactory.makePrismaPharmaceuticalForm({
        content: 'pill',
      }),
    ]);

    const [
      medicineVariant1,
      medicineVariant2,
      medicineVariant3,
      medicineVariant4,
    ] = await Promise.all([
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalForm1.id,
        unitMeasureId: unitMeasure1.id,
        dosage: '500',
      }),
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalForm2.id,
        unitMeasureId: unitMeasure2.id,
        dosage: '200',
      }),
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalForm1.id,
        unitMeasureId: unitMeasure1.id,
        dosage: '500',
      }),
      medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalForm2.id,
        unitMeasureId: unitMeasure2.id,
        dosage: '300',
      }),
    ]);

    await Promise.all([
      medicineStockFactory.makePrismaMedicineStock({
        medicineVariantId: medicineVariant1.id,
        stockId: stock.id,
        currentQuantity: 10,
      }),
      medicineStockFactory.makePrismaMedicineStock({
        medicineVariantId: medicineVariant2.id,
        stockId: stock.id,
        currentQuantity: 30,
      }),
      medicineStockFactory.makePrismaMedicineStock({
        medicineVariantId: medicineVariant3.id,
        stockId: stock.id,
        currentQuantity: 50,
      }),
      medicineStockFactory.makePrismaMedicineStock({
        medicineVariantId: medicineVariant4.id,
        stockId: stock.id,
        currentQuantity: 80,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/reports/inventory')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        institutionId: institution.id.toString(),
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.inventory).toHaveLength(4);
    expect(response.body.meta).toEqual(
      expect.objectContaining({
        totalCount: 4,
      }),
    );
  });

  test('[GET] /reports/inventory (grouped without batches)', async () => {
    const institution = await institutionFactory.makePrismaInstitution();
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    });
    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass();

    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    });
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure();
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm();
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
      });
    await medicineStockFactory.makePrismaMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 10,
    });

    const response = await request(app.getHttpServer())
      .get('/reports/inventory')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        institutionId: institution.id.toString(),
        group: true,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.stocks.length).toBeGreaterThan(0);
    expect(response.body.meta.totalCount).toBeGreaterThan(0);
  });

  test('[GET] /reports/inventory (grouped with batches)', async () => {
    const institution = await institutionFactory.makePrismaInstitution();
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    });
    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass();

    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    });
    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure();
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm();
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
        dosage: '500',
      });
    await medicineStockFactory.makePrismaMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 10,
    });

    const response = await request(app.getHttpServer())
      .get('/reports/inventory')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        institutionId: institution.id.toString(),
        group: true,
        includeBatches: true,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.stocks.length).toBeGreaterThan(0);
    const firstStock = response.body.stocks[0];
    const firstMedicine = firstStock.medicines[0];
    const firstMs = firstMedicine.medicineStocks[0];
    expect(firstMs).toHaveProperty('quantity');
    expect(firstMs).toHaveProperty('pharmaceuticalForm');
    expect(firstMs).toHaveProperty('unitMeasure');
  });
});
