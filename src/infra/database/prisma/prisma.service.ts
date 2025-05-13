import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'prisma/generated'
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
