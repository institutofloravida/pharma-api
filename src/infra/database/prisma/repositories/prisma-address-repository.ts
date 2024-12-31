import { AddresssRepository } from '@/domain/pharma/application/repositories/address-repository'
import { Address } from '@/domain/pharma/enterprise/entities/address'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'

@Injectable()
export class PrismaAddressRepository implements AddresssRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })
  }
}
