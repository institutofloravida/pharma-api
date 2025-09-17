import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvModule } from '@/infra/env/env.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { InstitutionFactory } from 'test/factories/make-insitution';
import { OperatorFactory } from 'test/factories/make-operator';
describe('Deactivate Operator (E2E)', () => {
  let app: INestApplication;
  let institutionFactory: InstitutionFactory;
  let operatorFactory: OperatorFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [OperatorFactory, OperatorFactory, InstitutionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    institutionFactory = moduleRef.get(InstitutionFactory);

    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[PATCH] /operator/:id/deactivate', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const institution = await institutionFactory.makePrismaInstitution();

    const operator = await operatorFactory.makePrismaOperator({
      name: 'Carlos Augustus',
      email: 'carlosaugustus@gmail.com',
      institutionsIds: [institution.id],
      active: true,
      role: OperatorRole.COMMON,
      passwordHash: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .patch(`/operator/${operator.id.toString()}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const operatorOnDataBase = await prisma.operator.findUnique({
      where: {
        id: operator.id.toString(),
      },
    });

    expect(operatorOnDataBase).toEqual(
      expect.objectContaining({
        active: false,
      }),
    );
  });
});
