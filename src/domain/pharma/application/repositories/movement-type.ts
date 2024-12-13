import { MovementType } from '../../enterprise/entities/movement-type'

export abstract class MovementTypesRepository {
  abstract create(movementType: MovementType): Promise<void>
}
