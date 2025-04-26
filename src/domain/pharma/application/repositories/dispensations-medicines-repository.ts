import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dispensation } from '../../enterprise/entities/dispensation'
import { Meta } from '@/core/repositories/meta'
import { DispensationWithPatient } from '../../enterprise/entities/value-objects/dispensation-with-patient'

export abstract class DispensationsMedicinesRepository {
  abstract create(dispensation: Dispensation): Promise<void>
  abstract findMany(params: PaginationParams, filters: {
    patientId?: string,
    dispensationDate?: Date
  }): Promise<{ dispensations: DispensationWithPatient[], meta: Meta }>
}
