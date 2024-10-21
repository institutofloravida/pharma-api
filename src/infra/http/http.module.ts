import { Module } from '@nestjs/common'
import { CreateAccountOperatorController } from './controllers/create-account-operator.controler'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [CreateAccountOperatorController],
  providers: [PrismaService],
})
export class HttpModule {}
