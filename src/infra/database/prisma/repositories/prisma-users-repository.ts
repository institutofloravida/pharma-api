import { UsersRepository } from '@/domain/pharma/application/repositories/users-repository'
import { User } from '@/domain/pharma/enterprise/entities/user'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  create(user: User): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  findByCpf(cpf: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  findBySus(sus: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }
}
