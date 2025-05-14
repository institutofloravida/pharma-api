import { left, right, type Either } from '@/core/either'

import {
  Patient,
  type Gender,
  type Race,
} from '../../../enterprise/entities/patient'
import { PatientsRepository } from '../../repositories/patients-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PathologiesRepository } from '../../repositories/pathologies-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Address } from '@/domain/pharma/enterprise/entities/address'
import { PatientAlreadyExistsError } from './_erros/patient-already-exists-error'
import { AddresssRepository } from '../../repositories/address-repository'

interface createPatientUseCaseRequest {
  name: string;
  cpf?: string;
  sus: string;
  birthDate: Date;
  gender: Gender;
  race: Race;
  generalRegistration?: string | null;
  addressPatient: {
    street?: string;
    number?: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  pathologiesIds: string[];
}

type createPatientUseCaseResponse = Either<
  PatientAlreadyExistsError | ResourceNotFoundError,
  {
    patient: Patient;
  }
>

@Injectable()
export class CreatePatientUseCase {
  constructor(
    private patientRepository: PatientsRepository,
    private pathologyRepository: PathologiesRepository,
    private addressRepository: AddresssRepository,
  ) {}

  async execute({
    name,
    cpf,
    sus,
    birthDate,
    gender,
    race,
    generalRegistration,
    addressPatient,
    pathologiesIds,
  }: createPatientUseCaseRequest): Promise<createPatientUseCaseResponse> {
    const pathologiesCheck = await Promise.all(
      pathologiesIds.map(async (id) => {
        const pathology = await this.pathologyRepository.findById(id)
        return !!pathology
      }),
    )

    if (pathologiesCheck.includes(false)) {
      return left(
        new ResourceNotFoundError('One or more pathologies not found'),
      )
    }

    const patientWithSameCpf = await this.patientRepository.findByCpf(cpf || '')
    const patientWithSameSus = await this.patientRepository.findBySus(sus)
    if (patientWithSameCpf) {
      return left(
        new PatientAlreadyExistsError(
          `Alredy exists an patient with CPF ${patientWithSameCpf.cpf}`,
        ),
      )
    }

    if (patientWithSameSus) {
      return left(
        new PatientAlreadyExistsError(
          `Alredy exists an patient with SUS card ${patientWithSameSus.sus}`,
        ),
      )
    }

    const { city, neighborhood, number, state, street, zipCode, complement } =
      addressPatient

    const address = Address.create({
      city,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    })

    const patient = Patient.create({
      name,
      cpf,
      sus,
      birthDate,
      gender,
      race,
      generalRegistration,
      addressId: new UniqueEntityId(address.id.toString()),
      pathologiesIds: pathologiesIds.map((id) => new UniqueEntityId(id)),
    })

    await this.addressRepository.create(address)
    await this.patientRepository.create(patient)

    return right({
      patient,
    })
  }
}
