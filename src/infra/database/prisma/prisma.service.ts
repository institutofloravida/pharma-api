import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'prisma/generated/prisma'
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit,
OnModuleDestroy {
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleDestroy() {
    this.$disconnect()
  }

  onModuleInit() {
    this.$connect()
  }
}
