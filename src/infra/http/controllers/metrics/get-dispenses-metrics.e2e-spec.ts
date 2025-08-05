import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { DispensationFactory } from 'test/factories/make-dispensation';
import { PatientFactory } from 'test/factories/make-patient';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AddressFactory } from 'test/factories/make-address';
import { InstitutionFactory } from 'test/factories/make-insitution';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { BatchFactory } from 'test/factories/make-batch';
import { BatchStockFactory } from 'test/factories/make-batch-stock';
import { ManufacturerFactory } from 'test/factories/make-manufacturer';
import { MedicineFactory } from 'test/factories/make-medicine';
import { MedicineExitFactory } from 'test/factories/make-medicine-exit';
import { MedicineStockFactory } from 'test/factories/make-medicine-stock';
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant';
import { MovementTypeFactory } from 'test/factories/make-movement-type';
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form';
import { StockFactory } from 'test/factories/make-stock';
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class';
import { UnitMeasureFactory } from 'test/factories/make-unit-measure';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { addDays } from 'date-fns';
import { MovimentationFactory } from 'test/factories/make-movimentation';

describe('Get Dispense Metrics (E2E)', () => {
  let app: INestApplication;
  let medicineExitFactory: MedicineExitFactory;
  let manufacturerFactory: ManufacturerFactory;
  let stockFactory: StockFactory;
  let batchFactory: BatchFactory;
  let batchStockFactory: BatchStockFactory;
  let medicineStockFactory: MedicineStockFactory;
  let medicineVariantFactory: MedicineVariantFactory;
  let unitMeasureFactory: UnitMeasureFactory;
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory;
  let medicineFactory: MedicineFactory;
  let therapeuticClassFactory: TherapeuticClassFactory;
  let patientFactory: PatientFactory;
  let operatorFactory: OperatorFactory;
  let dispensationFactory: DispensationFactory;
  let institutionFactory: InstitutionFactory;
  let movimentationFactory: MovimentationFactory;
  let prisma: PrismaService;

  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DispensationFactory,
        PatientFactory,
        AddressFactory,
        InstitutionFactory,
        MedicineExitFactory,
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        MedicineVariantFactory,
        StockFactory,
        BatchStockFactory,
        BatchFactory,
        MedicineStockFactory,
        MovementTypeFactory,
        ManufacturerFactory,
        MovimentationFactory,
        PrismaService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    operatorFactory = moduleRef.get(OperatorFactory);
    medicineExitFactory = moduleRef.get(MedicineExitFactory);
    institutionFactory = moduleRef.get(InstitutionFactory);
    manufacturerFactory = moduleRef.get(ManufacturerFactory);
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory);
    batchFactory = moduleRef.get(BatchFactory);
    batchStockFactory = moduleRef.get(BatchStockFactory);
    medicineStockFactory = moduleRef.get(MedicineStockFactory);
    stockFactory = moduleRef.get(StockFactory);
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory);
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory);
    medicineFactory = moduleRef.get(MedicineFactory);
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory);
    prisma = moduleRef.get(PrismaService);
    patientFactory = moduleRef.get(PatientFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    dispensationFactory = moduleRef.get(DispensationFactory);
    institutionFactory = moduleRef.get(InstitutionFactory);
    movimentationFactory = moduleRef.get(MovimentationFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('[GET] /metrics/dispense', async () => {
    const date = new Date(2025, 0, 1);
    vi.setSystemTime(date);

    const institution = await institutionFactory.makePrismaInstitution();
    const manufacturer = await manufacturerFactory.makePrismaManufacturer();
    const operator = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
      institutionsIds: [institution.id],
    });

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    });

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure();
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm();
    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass();
    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    });
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
      });

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    });

    const batch = await batchFactory.makePrismaBatch({
      manufacturerId: manufacturer.id,
    });
    const batch2 = await batchFactory.makePrismaBatch({
      manufacturerId: manufacturer.id,
    });

    const medicineStock = await medicineStockFactory.makePrismaMedicineStock({
      batchesStockIds: [],
      currentQuantity: 50,
      stockId: stock.id,
      medicineVariantId: medicineVariant.id,
    });

    const batchStock = await batchStockFactory.makePrismaBatchStock({
      batchId: batch.id,
      currentQuantity: 40,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    });

    const batchStock2 = await batchStockFactory.makePrismaBatchStock({
      batchId: batch2.id,
      currentQuantity: 10,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    });

    await prisma.medicineStock.update({
      where: {
        id: medicineStock.id.toString(),
      },
      data: {
        batchesStocks: {
          connect: [
            { id: batchStock.id.toString() },
            { id: batchStock2.id.toString() },
          ],
        },
      },
    });
    const patient = await patientFactory.makePrismaPatient({});

    const [dispensation1, dispensation2] = await Promise.all([
      dispensationFactory.makePrismaDispensation({
        dispensationDate: new Date(2025, 0, 1),
        patientId: patient.id,
        operatorId: operator.id,
      }),
      dispensationFactory.makePrismaDispensation({
        dispensationDate: addDays(new Date(2025, 0, 1), 1),
        patientId: patient.id,
        operatorId: operator.id,
      }),
    ]);

    const [exit1, exit2] = await Promise.all([
      medicineExitFactory.makePrismaMedicineExit({
        exitType: ExitType.DISPENSATION,
        operatorId: operator.id,
        stockId: stock.id,
        movementTypeId: undefined,
        dispensationId: dispensation1.id,
        destinationInstitutionId: undefined,
        transferId: undefined,
        exitDate: new Date(2025, 0, 1),
      }),
      medicineExitFactory.makePrismaMedicineExit({
        exitType: ExitType.DISPENSATION,
        operatorId: operator.id,
        stockId: stock.id,
        dispensationId: dispensation2.id,
        destinationInstitutionId: undefined,
        transferId: undefined,
        movementTypeId: undefined,
        exitDate: new Date(2025, 0, 2),
      }),
    ]);

    await Promise.all([
      movimentationFactory.makePrismaMovimentation({
        batchStockId: batchStock.id,
        quantity: 20,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,
      }),
      movimentationFactory.makePrismaMovimentation({
        batchStockId: batchStock2.id,
        quantity: 10,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/metrics/dispense/${institution.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.dispense).toEqual({
      today: {
        total: 1,
        percentageAboveAverage: 0,
      },
      month: {
        total: 2,
        percentageComparedToLastMonth: 0,
      },
    });
  });
});
