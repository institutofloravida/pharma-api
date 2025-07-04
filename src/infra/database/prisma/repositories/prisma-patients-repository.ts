import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaPatientMapper } from '../mappers/prisma-patient-mapper'

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(patient: Patient): Promise<void> {
    const patientMapped = PrismaPatientMapper.toPrisma(patient)

    await this.prisma.patient.create({
      data: patientMapped,
    })
  }

  async save(patient: Patient): Promise<void> {
    const patientMapped = PrismaPatientMapper.toPrisma(patient)

    await this.prisma.patient.update({
      data: patientMapped,
      where: {
        id: patient.id.toString(),
      },
    })
  }

  async savePathologies(patientId: string, pathologiesIds: string[]): Promise<void> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { pathologies: { select: { id: true } } },
    })

    const currentIds = patient?.pathologies.map(p => p.id) ?? []

    const disconnectIds = currentIds.filter(id => !pathologiesIds.includes(id))

    await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        pathologies: {
          connect: pathologiesIds.map(id => ({ id })),
          disconnect: disconnectIds.map(id => ({ id })),
        },
      },
    })
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        pathologies: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!patient) {
      return null
    }

    return PrismaPatientMapper.toDomain(patient)
  }

  async findByCpf(cpf: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        cpf,
      },
      include: {
        pathologies: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!patient) {
      return null
    }

    return PrismaPatientMapper.toDomain(patient)
  }

  async findBySus(sus: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        sus,
      },
      include: {
        pathologies: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!patient) {
      return null
    }

    return PrismaPatientMapper.toDomain(patient)
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      name?: string;
      cpf?: string;
      sus?: string;
      birthDate?: Date;
      generalRegistration?: string;
      pathologyId?: string;
    },
  ): Promise<{ patients: Patient[]; meta: Meta }> {
    const { birthDate, cpf, generalRegistration, name, pathologyId, sus } =
      filters

    const [patients, patientsTotalCount] = await Promise.all([
      await this.prisma.patient.findMany({
        where: {
          name: {
            contains: name ?? '',
            mode: 'insensitive',
          },
          ...(cpf && { cpf }),
          ...(sus && { sus }),
          ...(generalRegistration && { generalRegistration }),
          ...(birthDate && {
            birthDate: { gte: new Date(birthDate), lte: new Date(birthDate) },
          }),
          ...(pathologyId && {
            pathologies: {
              some: {
                id: pathologyId,
              },
            },
          }),
        },
        include: {
          pathologies: {
            select: {
              id: true,
            },
          },
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      await this.prisma.patient.count({
        where: {
          name: {
            contains: name ?? '',
            mode: 'insensitive',
          },
          ...(cpf && { cpf }),
          ...(sus && { sus }),
          ...(generalRegistration && { generalRegistration }),
          ...(birthDate && {
            birthDate: { gte: new Date(birthDate), lte: new Date(birthDate) },
          }),
        },
      }),
    ])

    const patientsPaginated = patients.map((item) =>
      PrismaPatientMapper.toDomain(item),
    )
    return {
      patients: patientsPaginated,
      meta: {
        page,
        totalCount: patientsTotalCount,
      },
    }
  }

  async getPatientsMetrics(institutionId: string): Promise<{ total: number; receiveMonth: number }> {
    const [total, receiveMonth] = await this.prisma.$transaction([
      this.prisma.patient.count(),
      this.prisma.dispensation.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        distinct: ['patientId'],
        select: { patientId: true },
      }),
    ])

    return {
      total,
      receiveMonth: receiveMonth.length,
    }
  }
}
