import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dispensation } from '../../enterprise/entities/dispensation'
import { Meta } from '@/core/repositories/meta'

export abstract class DispensationsMedicinesRepository {
  abstract create(dispensation: Dispensation): Promise<void>
  abstract findMany(params: PaginationParams, filters: {
    patientId?: string,
  }): Promise<{ dispensations: Dispensation[], meta: Meta }>
}
