import { ValueObject } from '@/core/entities/value-object';
import { ExitType } from '../exit';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MovementDirection } from '../movement-type';

export interface MovimentationDetailsProps {
  direction: MovementDirection;
  operator: string;
  operatorId: UniqueEntityId;
  stock: string;
  stockId: UniqueEntityId;
  medicine: string;
  medicineId: UniqueEntityId;
  pharmaceuticalForm: string;
  pharmaceuticalFormId: UniqueEntityId;
  unitMeasure: string;
  unitMeasureId: UniqueEntityId;
  dosage: string;
  complement?: string | null;
  medicineVariantId: UniqueEntityId;
  medicineStockId: UniqueEntityId;
  batchCode: string;
  batchStockId: UniqueEntityId;
  quantity: number;
  movementDate: Date;
  movementType?: string;
  movementTypeId?: UniqueEntityId | null;
  exitType?: ExitType;
}

export class MovimentationDetails extends ValueObject<MovimentationDetailsProps> {
  get direction() {
    return this.props.direction;
  }

  get operator() {
    return this.props.operator;
  }

  get operatorId() {
    return this.props.operatorId;
  }

  get stock() {
    return this.props.stock;
  }

  get stockId() {
    return this.props.stockId;
  }

  get medicine() {
    return this.props.medicine;
  }

  get medicineId() {
    return this.props.medicineId;
  }

  get pharmaceuticalForm() {
    return this.props.pharmaceuticalForm;
  }

  get pharmaceuticalFormId() {
    return this.props.pharmaceuticalFormId;
  }

  get unitMeasure() {
    return this.props.unitMeasure;
  }

  get unitMeasureId() {
    return this.props.unitMeasureId;
  }

  get dosage() {
    return this.props.dosage;
  }

  get complement() {
    return this.props.complement;
  }

  get medicineVariantId() {
    return this.props.medicineVariantId;
  }

  get medicineStockId() {
    return this.props.medicineStockId;
  }

  get batchCode() {
    return this.props.batchCode;
  }

  get batchStockId() {
    return this.props.batchStockId;
  }

  get quantity() {
    return this.props.quantity;
  }

  get movementDate() {
    return this.props.movementDate;
  }

  get movementType() {
    return this.props.movementType;
  }

  get movementTypeId() {
    return this.props.movementTypeId;
  }

  get exitType() {
    return this.props.exitType;
  }

  static create(props: MovimentationDetailsProps) {
    return new MovimentationDetails(props);
  }
}
