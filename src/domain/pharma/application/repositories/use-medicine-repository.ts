import type { UseMedicine } from '../../enterprise/use-medicine'

export abstract class UseMedicinesRepository {
  abstract create(useMedicine: UseMedicine): Promise<void>
  abstract save(useMedicine: UseMedicine): Promise<void>
  abstract findByYearAndMonth(year: number, month: number): Promise<UseMedicine | null>
  abstract findById(id: string): Promise<UseMedicine | null>
}
