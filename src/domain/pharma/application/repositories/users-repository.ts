import type { User } from '../../enterprise/entities/user'

export interface UsersRepository {
  create(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  findBySus(sus: string): Promise<User | null>
}
