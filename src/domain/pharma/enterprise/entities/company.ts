import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

export interface CompanyProps extends AuxiliaryRecordProps {
  cnpj: string
  description?: string | null
}

export abstract class Company<Props extends CompanyProps>
  extends AuxiliaryRecord<Props > {
  get cnpj() {
    return this.props.cnpj
  }

  set cnpj(value: string) {
    this.props.cnpj = value
    this.touch()
  }

  get description() {
    return this.props.description
  }
}
