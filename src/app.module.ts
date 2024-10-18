import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountOperatorController } from './controllers/create-account-operator.controler'

@Module({
  imports: [],
  controllers: [CreateAccountOperatorController],
  providers: [PrismaService],
})
export class AppModule {}
