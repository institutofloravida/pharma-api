import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import { MovementType } from '@/domain/pharma/enterprise/entities/movement-type'

export class InMemoryMovementTypesRepository implements MovementTypesRepository {
  public itens: MovementType[] = []

  async create(movementType: MovementType): Promise<void> {
    this.itens.push(movementType)
  }
}
