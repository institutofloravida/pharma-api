import { Medicine } from '../../enterprise/entities/medicine'

export interface MedicinesRepository {
  create(medicine: Medicine): Promise<void>
  medicineExists(medicine: Medicine): Promise<Medicine | null>
  findById(id:string): Promise<Medicine | null>
}
