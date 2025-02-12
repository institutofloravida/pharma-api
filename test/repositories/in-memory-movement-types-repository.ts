import type { Meta } from '@/core/repositories/meta'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import {
  MovementType,
  type MovementDirection,
} from '@/domain/pharma/enterprise/entities/movement-type'

export class InMemoryMovementTypesRepository
implements MovementTypesRepository {
  public items: MovementType[] = []

  async create(movementType: MovementType): Promise<void> {
    this.items.push(movementType)
  }

  async findByContent(content: string): Promise<MovementType | null> {
    const movementType = this.items.find((movementType) => {
      return movementType.content
        .toLocaleLowerCase()
        .includes(content.toLocaleLowerCase())
    })

    if (!movementType) {
      return null
    }

    return movementType
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string; direction?: MovementDirection },
  ): Promise<{ movementTypes: MovementType[]; meta: Meta }> {
    const { content, direction } = filters

    const movementTypesFiltered = this.items
      .filter((movementType) => {
        if (
          direction &&
          !(movementType.direction.toString() === direction.toString())
        ) {
          return false
        }

        if (
          content &&
          !movementType.content.toLowerCase().includes(content.toLowerCase())
        ) { return false }

        return movementType
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const movementTypesPaginated = movementTypesFiltered.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      movementTypes: movementTypesPaginated,
      meta: {
        page,
        totalCount: movementTypesFiltered.length,
      },
    }
  }
}
