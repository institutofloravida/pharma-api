/* eslint-disable no-unused-vars */
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum Gender {
  M = 'M',
  F = 'F',
  O = 'O',
}

export enum Race {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  MIXED = 'MIXED',
  UNDECLARED = 'UNDECLARED',
  INDIGENOUS = 'INDIGENOUS',
}

export class AddressDTO {
  @ApiPropertyOptional({ description: 'Street name', example: 'Elm Street' })
  @IsString()
  @IsOptional()
  street: string

  @ApiPropertyOptional({ description: 'House or apartment number', example: '45B' })
  @IsString()
  @IsOptional()
  number: string

  @ApiProperty({
    description: 'Additional address details',
    example: 'Apartment 3A',
    required: false,
  })
  @IsOptional()
  @IsString()
  complement?: string | null

  @ApiProperty({ description: 'Neighborhood name', example: 'Downtown' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @ApiProperty({ description: 'City name', example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({ description: 'State name', example: 'IL' })
  @IsString()
  @IsNotEmpty()
  state: string

  @ApiPropertyOptional({ description: 'ZIP or postal code', example: '62704' })
  @IsString()
  @IsOptional()
  zipCode?: string
}

export class CreatePatientDto {
  @ApiProperty({ description: 'Full name of the patient', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: 'CPF number of the patient',
    example: '12345678900',
  })
  @IsString()
  @IsOptional()
  cpf?: string | null

  @ApiProperty({
    description: 'SUS number of the patient',
    example: '123456789012345',
  })
  @IsString()
  @IsNotEmpty()
  sus: string

  @ApiProperty({
    description: 'Birth date of the patient',
    example: '1990-01-01',
  })
  @IsDate()
  @Type(() => Date)
  birthDate: Date

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: 'M',
  })
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty({
    description: 'Race of the patient',
    enum: Race,
    example: 'WHITE',
  })
  @IsEnum(Race)
  race: Race

  @ApiProperty({
    description: 'General registration of the patient',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  generalRegistration?: string | null

  @ApiProperty({
    description: 'Address details of the patient',
    type: AddressDTO,
  })
  @ValidateNested()
  @Type(() => AddressDTO)
  addressPatient: AddressDTO

  @ApiProperty({
    description: 'List of pathology IDs associated with the patient',
    type: [String],
    example: ['pathology-1', 'pathology-2'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  pathologiesIds: string[]
}
