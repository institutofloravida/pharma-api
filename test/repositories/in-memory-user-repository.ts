import type { UserRepository } from '@/domain/pharma/application/repositories/user-repository'
import type { User } from '@/domain/pharma/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async findById(id: string) {
    const user = this.items.find(item => item.id.toString() === id)
    if (user) {
      return user
    }
    return null
  }

  async findByCpf(cpf: string) {
    const user = this.items.find(item => item.cpf.toString() === cpf)
    if (user) {
      return user
    }
    return null
  }

  async findBySus(sus: string) {
    const user = this.items.find(item => item.sus.toString() === sus)
    if (user) {
      return user
    }
    return null
  }
}
