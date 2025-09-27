import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvModule } from '@/infra/env/env.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { InstitutionFactory } from 'test/factories/make-insitution';
import { OperatorFactory } from 'test/factories/make-operator';
import { StockFactory } from 'test/factories/make-stock';
describe('Delete Stock (E2E)', () => {
  let app: INestApplication;
  let institutionFactory: InstitutionFactory;
  let operatorFactory: OperatorFactory;
  let stockFactory: StockFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [
        OperatorFactory,
        OperatorFactory,
        InstitutionFactory,
        StockFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    institutionFactory = moduleRef.get(InstitutionFactory);
    stockFactory = moduleRef.get(StockFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /stock/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const institution = await institutionFactory.makePrismaInstitution();

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/stock/${stock.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const stockOnDatabase = await prisma.stock.findUnique({
      where: {
        id: stock.id.toString(),
      },
    });

    expect(stockOnDatabase).toBeNull();
  });
});
