import type { MetaReport } from '@/core/repositories/meta'
import { UseMedicine } from '../../enterprise/entities/use-medicine'
import type { UseMedicineDetails } from '../../enterprise/entities/value-objects/use-medicine-details'

export abstract class UseMedicinesRepository {
  abstract create(useMedicine: UseMedicine): Promise<void>
  abstract save(useMedicine: UseMedicine): Promise<void>
  abstract findByMedicineStockIdAndYearAndMonth(year: number, month: number, medicineStockId: string): Promise<UseMedicine | null>
  abstract fetchMonthlyMedicinesUtilization(filters: {
    institutionId: string,
    year: number,
    month: number,
    stockId?: string
  }): Promise<{ utilization: UseMedicineDetails[], totalUtilization: number, meta: MetaReport }>
}
