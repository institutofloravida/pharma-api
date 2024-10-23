import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'

export class InMemoryDispensationsMedicinesRepository implements DispensationsMedicinesRepository {
  public items: Dispensation[] = []
  async create(dispensation: Dispensation) {
    this.items.push(dispensation)
  }
}
