import { PaginationParams } from '@/core/repositories/pagination-params'
import { Medicine } from '../../enterprise/entities/medicine'
import { Meta } from '@/core/repositories/meta'

export abstract class MedicinesRepository {
  abstract create(medicine: Medicine): Promise<void>
  abstract medicineExists(medicine: Medicine): Promise<Medicine | null>
  abstract findById(id:string): Promise<Medicine | null>
  abstract findMany(params: PaginationParams, content?: string): Promise<{ medicines: Medicine[], meta: Meta }>
}
