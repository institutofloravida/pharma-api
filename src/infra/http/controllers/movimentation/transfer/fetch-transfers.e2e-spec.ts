import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { PatientFactory } from 'test/factories/make-patient';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { MedicineExitFactory } from 'test/factories/make-medicine-exit';
import { BatchFactory } from 'test/factories/make-batch';
import { BatchStockFactory } from 'test/factories/make-batch-stock';
import { InstitutionFactory } from 'test/factories/make-insitution';
import { ManufacturerFactory } from 'test/factories/make-manufacturer';
import { MedicineFactory } from 'test/factories/make-medicine';
import { MedicineStockFactory } from 'test/factories/make-medicine-stock';
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant';
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form';
import { StockFactory } from 'test/factories/make-stock';
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class';
import { UnitMeasureFactory } from 'test/factories/make-unit-measure';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { MovimentationFactory } from 'test/factories/make-movimentation';
import { TransferFactory } from 'test/factories/make-transfer';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';

describe('Fetch Transfer (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let medicineExitFactory: MedicineExitFactory;
  let manufacturerFactory: ManufacturerFactory;
  let institutionFactory: InstitutionFactory;
  let stockFactory: StockFactory;
  let batchFactory: BatchFactory;
  let batchStockFactory: BatchStockFactory;
  let medicineStockFactory: MedicineStockFactory;
  let medicineVariantFactory: MedicineVariantFactory;
  let unitMeasureFactory: UnitMeasureFactory;
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory;
  let medicineFactory: MedicineFactory;
  let therapeuticClassFactory: TherapeuticClassFactory;
  let movimentationFactory: MovimentationFactory;
  let transferFactory: TransferFactory;
  let prisma: PrismaService;

  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MedicineExitFactory,
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        InstitutionFactory,
        MedicineVariantFactory,
        StockFactory,
        PatientFactory,
        BatchStockFactory,
        BatchFactory,
        MedicineStockFactory,
        ManufacturerFactory,
        MovimentationFactory,
        TransferFactory,
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
    movimentationFactory = moduleRef.get(MovimentationFactory);
    transferFactory = moduleRef.get(TransferFactory);
    prisma = moduleRef.get(PrismaService);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /movement/transfer', async () => {
    const institution = await institutionFactory.makePrismaInstitution();
    const institution2 = await institutionFactory.makePrismaInstitution();
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

    const stock2 = await stockFactory.makePrismaStock({
      institutionId: institution2.id,
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

    const transfer = await transferFactory.makePrismaTransfer({
      status: TransferStatus.PENDING,
      stockDestinationId: stock2.id,
    });

    const transfer2 = await transferFactory.makePrismaTransfer({
      status: TransferStatus.PENDING,
      stockDestinationId: stock2.id,
    });

    const [exit1, exit2] = await Promise.all([
      medicineExitFactory.makePrismaMedicineExit({
        exitType: ExitType.TRANSFER,
        operatorId: operator.id,
        stockId: stock.id,
        movementTypeId: undefined,
        dispensationId: undefined,
        exitDate: new Date(2025, 0, 1),
        destinationInstitutionId: undefined,
        transferId: transfer.id,
      }),
      medicineExitFactory.makePrismaMedicineExit({
        movementTypeId: undefined,
        exitType: ExitType.TRANSFER,
        operatorId: operator.id,
        dispensationId: undefined,
        stockId: stock.id,
        exitDate: new Date(2025, 0, 1),
        destinationInstitutionId: undefined,
        transferId: transfer2.id,
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
      .get('/movement/transfer')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        institutionId: institution.id.toString(),
        status: TransferStatus.PENDING,
      })
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.transfers).toHaveLength(2);
  });
});
