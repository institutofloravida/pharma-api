import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaOperatorsRepository } from './prisma/repositories/prisma-operators-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'

@Module({
  providers: [PrismaService, { provide: OperatorsRepository, useClass: PrismaOperatorsRepository }, PrismaUsersRepository],
  exports: [PrismaService, OperatorsRepository, PrismaUsersRepository],
})
export class DatabaseModule {}
