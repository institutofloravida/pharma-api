import { Dispensation } from '../../enterprise/entities/dispensation'

export interface DispensationsMedicinesRepository {
  create(dispensation: Dispensation): Promise<void>
}
