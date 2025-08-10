import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { UnitMeasureFactory } from 'test/factories/make-unit-measure';

describe('Delete Unit Measure (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let unitmeasureFactory: UnitMeasureFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, UnitMeasureFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    unitmeasureFactory = moduleRef.get(UnitMeasureFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /unit-measure/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const unitmeasure = await unitmeasureFactory.makePrismaUnitMeasure();

    const response = await request(app.getHttpServer())
      .delete(`/unit-measure/${unitmeasure.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const unitmeasureOnDataBase = await prisma.unitMeasure.findFirst({
      where: {
        id: unitmeasure.id.toString(),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(unitmeasureOnDataBase).toBeFalsy();
  });
});
