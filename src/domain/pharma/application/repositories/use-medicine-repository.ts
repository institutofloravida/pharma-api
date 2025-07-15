import type { MetaReport } from '@/core/repositories/meta'
import { UseMedicine } from '../../enterprise/use-medicine'

export abstract class UseMedicinesRepository {
  abstract create(useMedicine: UseMedicine): Promise<void>
  abstract save(useMedicine: UseMedicine): Promise<void>
  abstract findByMedicineStockIdAndYearAndMonth(year: number, month: number, medicineStockId: string): Promise<UseMedicine | null>
  abstract fetchMonthlyMedicinesUtilization(filters: {
    institutionId: string,
    year: number,
    month: number,
    stockId?: string
  }): Promise<{ utilization: UseMedicine[], totalUtilization: number, meta: MetaReport }>
}
