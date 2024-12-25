import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Patient as PrismaPatient, Prisma } from '@prisma/client'

export class PrismaPatientMapper {
  static toDomain(raw: PrismaPatient): Patient {
    return Patient.create({
      addressId: new UniqueEntityId(raw.addressId),
      createdAt: raw.createdAt,
      birthDate: raw.birthDate,
      cpf: raw.cpf,
      gender: raw.gender,
      name: raw.name,
      pathologiesIds: raw.pathologiesIds.map(item => new UniqueEntityId(item)),
      race: raw.race,
      sus: raw.sus,
      generalRegistration: raw.generalRegistration,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(patient: Patient): Prisma.PatientUncheckedCreateInput {
    return {
      id: patient.id.toString(),
      name: patient.name,
      gender: patient.gender,
      addressId: patient.addressId.toString(),
      birthDate: patient.birthDate,
      cpf: patient.cpf,
      race: patient.race,
      sus: patient.sus,
      generalRegistration: patient.generalRegistration,
      pathologiesIds: patient.pathologiesIds.map(item => item.toString()),
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }
  }
}
