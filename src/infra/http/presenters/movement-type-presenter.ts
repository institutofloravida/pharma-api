import type { MovementType } from '@/domain/pharma/enterprise/entities/movement-type'

export class MovementTypePresenter {
  static toHTTP(movementType: MovementType) {
    return {
      id: movementType.id.toString(),
      name: movementType.content,
      direction: movementType.direction,
    }
  }
}
