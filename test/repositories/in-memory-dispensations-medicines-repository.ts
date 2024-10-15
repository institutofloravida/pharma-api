import type { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import type { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'

export class InMemoryDispensationsMedicinesRepository implements DispensationsMedicinesRepository {
  public items: Dispensation[] = []
  async create(dispensation: Dispensation) {
    this.items.push(dispensation)
  }
}
