import { UsersRepository } from '@/domain/pharma/application/repositories/users-repository'
import { User } from '@/domain/pharma/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
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
