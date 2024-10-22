import { Module } from '@nestjs/common'
import { CreateAccountOperatorController } from './controllers/create-account-operator.controler'
import { PrismaService } from '../prisma/prisma.service'
import { AuthenticateOperatorController } from './controllers/authenticate-operator.controller'
import { CreateTherapeuticClassController } from './controllers/create-therapeutic-class.controller'

@Module({
  controllers: [CreateAccountOperatorController, AuthenticateOperatorController, CreateTherapeuticClassController],
  providers: [PrismaService],
})
export class HttpModule {}
