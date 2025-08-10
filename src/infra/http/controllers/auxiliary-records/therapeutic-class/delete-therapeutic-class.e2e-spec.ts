import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OperatorFactory } from 'test/factories/make-operator';
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class';

describe('Delete TherapeuticClass (E2E)', () => {
  let app: INestApplication;
  let operatorFactory: OperatorFactory;
  let therapeuticclassFactory: TherapeuticClassFactory;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OperatorFactory, TherapeuticClassFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    therapeuticclassFactory = moduleRef.get(TherapeuticClassFactory);
    operatorFactory = moduleRef.get(OperatorFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[DELETE] /therapeutic-class/:id', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: OperatorRole.MANAGER,
    });
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const therapeuticclass =
      await therapeuticclassFactory.makePrismaTherapeuticClass();

    const response = await request(app.getHttpServer())
      .delete(`/therapeutic-class/${therapeuticclass.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    const therapeuticclassOnDataBase = await prisma.therapeuticClass.findFirst({
      where: {
        id: therapeuticclass.id.toString(),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(therapeuticclassOnDataBase).toBeFalsy();
  });
});
