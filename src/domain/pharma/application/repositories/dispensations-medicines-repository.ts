import { Dispensation } from '../../enterprise/entities/dispensation'

export abstract class DispensationsMedicinesRepository {
  abstract create(dispensation: Dispensation): Promise<void>
}
