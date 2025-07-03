import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dispensation, type DispensationPerDay } from '../../enterprise/entities/dispensation'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { DispensationWithPatient } from '../../enterprise/entities/value-objects/dispensation-with-patient'
import { MostTreatedPathology } from '../../enterprise/entities/pathology'

export abstract class DispensationsMedicinesRepository {
  abstract create(dispensation: Dispensation): Promise<void>
  abstract findMany(
    params: PaginationParams,
    filters: {
      patientId?: string;
      dispensationDate?: Date;
    },
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: Meta }>
  abstract getDispensationMetrics(institutionId: string): Promise<{
    today: {
      total: number;
      percentageAboveAverage: number;
    };
    month: {
      total: number;
      percentageComparedToLastMonth: number;
    };
  }>
  abstract getDispensationsInAPeriod(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
    patientId?: string,
    operatorId?: string,
  ): Promise<{ dispensations: DispensationWithPatient[], meta: MetaReport }>
  abstract fetchDispensesPerDay(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ dispenses: DispensationPerDay[], meta: MetaReport }>
  abstract fetchMostTreatedPathologies(
    institutionId?: string,
  ): Promise<{ mostTreatedPathologies: MostTreatedPathology[] }>
}
