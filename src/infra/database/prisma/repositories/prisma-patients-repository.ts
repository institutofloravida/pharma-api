import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository';
import { Patient } from '@/domain/pharma/enterprise/entities/patient';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPatientMapper } from '../mappers/prisma-patient-mapper';
import { PatientDetails } from '@/domain/pharma/enterprise/entities/value-objects/patient-details';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaPathologyMapper } from '../mappers/prisma-pathology-mapper';
import type { Prisma } from 'prisma/generated';

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(patient: Patient): Promise<void> {
    const patientMapped = PrismaPatientMapper.toPrisma(patient);

    await this.prisma.patient.create({
      data: patientMapped,
    });
  }

  async save(patient: Patient): Promise<void> {
    const patientMapped = PrismaPatientMapper.toPrisma(patient);

    await this.prisma.patient.update({
      data: patientMapped,
      where: {
        id: patient.id.toString(),
      },
    });
  }

  async savePathologies(
    patientId: string,
    pathologiesIds: string[],
  ): Promise<void> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { pathologies: { select: { id: true } } },
    });

    const currentIds = patient?.pathologies.map((p) => p.id) ?? [];

    const disconnectIds = currentIds.filter(
      (id) => !pathologiesIds.includes(id),
    );

    await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        pathologies: {
          connect: pathologiesIds.map((id) => ({ id })),
          disconnect: disconnectIds.map((id) => ({ id })),
        },
      },
    });
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
    });

    if (!patient) {
      return null;
    }

    return PrismaPatientMapper.toDomain(patient);
  }

  async findByIdWithDetails(id: string): Promise<PatientDetails | null> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        pathologies: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        address: true,
      },
    });

    if (!patient || !patient.address) {
      return null;
    }

    const pathologiesMapped = patient.pathologies.map(
      PrismaPathologyMapper.toDomain,
    );

    const patientDetails = PatientDetails.create({
      patientId: new UniqueEntityId(patient.id),
      birthDate: patient.birthDate,
      createdAt: patient.createdAt,
      gender: patient.gender,
      name: patient.name,
      race: patient.race,
      sus: patient.sus,
      cpf: patient.cpf,
      generalRegistration: patient.generalRegistration,
      updatedAt: patient.updatedAt,
      pathologies: pathologiesMapped,
      address: {
        city: patient.address.city,
        neighborhood: patient.address.neighborhood,
        state: patient.address.state,
        complement: patient.address.complement,
        number: patient.address.number,
        street: patient.address.street,
        zipCode: patient.address.zipCode,
        id: new UniqueEntityId(patient.address.id),
      },
    });

    return patientDetails;
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
    });

    if (!patient) {
      return null;
    }

    return PrismaPatientMapper.toDomain(patient);
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
    });

    if (!patient) {
      return null;
    }

    return PrismaPatientMapper.toDomain(patient);
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
      filters;

    const whereClause: Prisma.PatientWhereInput = {
      ...(name &&
        !sus && {
          OR: [
            {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
            {
              sus: {
                contains: name,
                mode: 'insensitive',
              },
            },
          ],
        }),
      ...(cpf && { cpf }),
      ...(sus && {
        sus: {
          contains: (sus || name) ?? '',
          mode: 'insensitive',
        },
      }),
      ...(generalRegistration && { generalRegistration }),
      ...(birthDate && {
        birthDate: { gte: new Date(birthDate), lte: new Date(birthDate) },
      }),
      ...(pathologyId && {
        pathologies: {
          some: {
            id: {
              equals: pathologyId,
            },
          },
        },
      }),
    };

    const [patients, patientsTotalCount] = await Promise.all([
      await this.prisma.patient.findMany({
        where: whereClause,
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
        where: whereClause,
      }),
    ]);

    const patientsPaginated = patients.map((item) =>
      PrismaPatientMapper.toDomain(item),
    );
    return {
      patients: patientsPaginated,
      meta: {
        page,
        totalCount: patientsTotalCount,
      },
    };
  }

  async getPatientsMetrics(
    institutionId: string,
  ): Promise<{ total: number; receiveMonth: number }> {
    const [total, receiveMonth] = await this.prisma.$transaction([
      this.prisma.patient.count(),
      this.prisma.dispensation.findMany({
        where: {
          exit: {
            reverseAt: null,
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        distinct: ['patientId'],
        select: { patientId: true },
      }),
    ]);

    return {
      total,
      receiveMonth: receiveMonth.length,
    };
  }
}
