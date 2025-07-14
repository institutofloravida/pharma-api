import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'

export class InMemoryUseMedicinesRepository implements UseMedicinesRepository {
  public items: UseMedicine[] = []

  async create(useMedicine: UseMedicine): Promise<void> {
    this.items.push(useMedicine)
  }

  async save(useMedicine: UseMedicine): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equal(useMedicine.id),
    )
    this.items[itemIndex] = useMedicine
  }

  async findByYearAndMonth(
    year: number,
    month: number,
  ): Promise<UseMedicine | null> {
    const useMedicine = this.items.find(
      (useMedicine) => useMedicine.year === year && useMedicine.month === month,
    )
    if (!useMedicine) {
      return null
    }

    return useMedicine
  }
}
