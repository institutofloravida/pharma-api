import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form';

describe('Delete PharmaceuticalForm (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let pharmaceuticalformFactory: PharmaceuticalFormFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, PharmaceuticalFormFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    pharmaceuticalformFactory = moduleRef.get(PharmaceuticalFormFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /pharmaceutical-form/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const pharmaceuticalform =
      await pharmaceuticalformFactory.makePrismaPharmaceuticalForm();

    const response = await request(app.getHttpServer())
      .delete(`/pharmaceutical-form/${pharmaceuticalform.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const pharmaceuticalformOnDataBase =
      await prisma.pharmaceuticalForm.findFirst({
        where: {
          id: pharmaceuticalform.id.toString(),
        },
      });

    expect(response.statusCode).toBe(200);
    expect(pharmaceuticalformOnDataBase).toBeFalsy();
  });
});
