import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Patient as PrismaPatient, Prisma } from '@prisma/client'

export class PrismaPatientMapper {
  static toDomain(raw: PrismaPatient & { pathologies: { id: string }[] }): Patient {
    return Patient.create({
      addressId: raw.addressId
        ? new UniqueEntityId(raw.addressId)
        : null,
      createdAt: raw.createdAt,
      birthDate: raw.birthDate,
      cpf: raw.cpf,
      gender: raw.gender,
      name: raw.name,
      race: raw.race,
      sus: raw.sus,
      generalRegistration: raw.generalRegistration,
      updatedAt: raw.updatedAt,
      pathologiesIds: raw.pathologies.map(item => new UniqueEntityId(item.id)),
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(patient: Patient): Prisma.PatientUncheckedCreateInput {
    return {
      id: patient.id.toString(),
      name: patient.name,
      gender: patient.gender,
      addressId: patient.addressId
        ? patient.addressId.toString()
        : null,
      birthDate: patient.birthDate,
      cpf: patient.cpf,
      race: patient.race,
      sus: patient.sus,
      generalRegistration: patient.generalRegistration,
      pathologies: {
        connect: patient.pathologiesIds.map(item => {
          return { id: item.toString() }
        }),
      },
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }
  }
}
