import { hash } from 'bcryptjs';
import { InstitutionType, OperatorRole, PrismaClient } from './generated';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.transfer.deleteMany();
  await prisma.address.deleteMany();
  await prisma.movimentation.deleteMany();
  await prisma.useMedicine.deleteMany();
  await prisma.exit.deleteMany();
  await prisma.dispensation.deleteMany();
  await prisma.medicineEntry.deleteMany();
  await prisma.batcheStock.deleteMany();
  await prisma.medicineStock.deleteMany();
  await prisma.medicineVariant.deleteMany();
  await prisma.therapeuticClass.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmaceuticalForm.deleteMany();
  await prisma.unitMeasure.deleteMany();
  await prisma.pathology.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.movementType.deleteMany();
  await prisma.patient.deleteMany();
}

async function main() {
  await clearDatabase();

  const institution = await prisma.institution.create({
    data: {
      name: 'Instituto Flora Vida',
      cnpj: '01234567000189',
      controlStock: true,
      responsible: 'Joao da Silva',
      type: InstitutionType.ONG,
      description: '',
    },
  });
  const institution2 = await prisma.institution.create({
    data: {
      name: 'Ubs - módulo 20',
      cnpj: '01234567000110',
      controlStock: true,
      responsible: 'Maria Oliveira',
      type: InstitutionType.PUBLIC,
      description: '',
    },
  });
  const institution3 = await prisma.institution.create({
    data: {
      name: 'Clínica São José',
      cnpj: '01234567000120',
      controlStock: true,
      responsible: 'Francisco Paulo',
      type: InstitutionType.PRIVATE,
      description: '',
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Carlos Pereira',
      email: 'carlos.pereira@biovida.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.COMMON,
      institutions: {
        connect: {
          id: institution3.id,
        },
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Yuri Sousa',
      email: 'yurisousaenfer@gmail.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.MANAGER,
      institutions: {
        connect: [
          {
            id: institution3.id,
          },
          {
            id: institution.id,
          },
        ],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Sandyele',
      email: 'sandyele@gmail.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.SUPER_ADMIN,
      institutions: {
        connect: [
          {
            id: institution.id,
          },
          {
            id: institution2.id,
          },
          {
            id: institution3.id,
          },
        ],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Rodrigo Baluz',
      email: 'baluz@gmail.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.SUPER_ADMIN,
      institutions: {
        connect: [
          {
            id: institution.id,
          },
          {
            id: institution2.id,
          },
          {
            id: institution3.id,
          },
        ],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Instituto Flora Vida',
      email: 'floravida@gmail.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.SUPER_ADMIN,
      institutions: {
        connect: [
          {
            id: institution.id,
          },
          {
            id: institution2.id,
          },
          {
            id: institution3.id,
          },
        ],
      },
    },
  });

  await prisma.stock.createMany({
    data: [
      { name: 'Estoque 01', institutionId: institution.id },
      { name: 'Estoque 02', institutionId: institution2.id },
      { name: 'Estoque 03', institutionId: institution.id },
    ],
  });

  await prisma.manufacturer.createMany({
    data: [
      {
        name: 'Medley',
        cnpj: '11111111111111',
        description: 'Fabricante de medicamentos genéricos.',
      },
      {
        name: 'Eurofarma',
        cnpj: '22222222222222',
        description: 'Líder em medicamentos no Brasil.',
      },
      {
        name: 'Pfizer',
        cnpj: '33333333333333',
        description: 'Empresa global de biotecnologia.',
      },
      {
        name: 'Aché',
        cnpj: '44444444144333',
        description: 'Especializada em medicamentos e suplementos.',
      },
      {
        name: 'EMS',
        cnpj: '55555555000155',
        description: 'Maior farmacêutica brasileira.',
      },
    ],
  });

  await prisma.pathology.createMany({
    data: [
      { name: 'Hipertensão Arterial' },
      { name: 'Diabetes Mellitus' },
      { name: 'Infecção do Trato Urinário' },
      { name: 'Gripe' },
      { name: 'Dengue' },
      { name: 'Infecção de Garganta' },
      { name: 'Cefaleia (Dor de Cabeça)' },
      { name: 'Asma' },
      { name: 'Bronquite' },
      { name: 'Dermatite de Contato' },
      { name: 'Sinusite' },
      { name: 'Otite Média' },
      { name: 'Conjuntivite' },
      { name: 'Gastrite' },
      { name: 'Obesidade' },
      { name: 'Anemia Ferropriva' },
      { name: 'Síndrome do Intestino Irritável' },
      { name: 'Depressão' },
      { name: 'Ansiedade' },
      { name: 'Hipotireoidismo' },
      { name: 'Insônia' },
      { name: 'Artrite Reumatoide' },
      { name: 'Herpes Zoster' },
      { name: 'Viroses Respiratórias' },
      { name: 'Candidíase Vaginal' },
    ],
  });

  const pathology = await prisma.pathology.findFirst();

  await prisma.address.create({
    data: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim das Rosas',
      city: 'Parnaíba',
      state: 'PI',
      zipCode: '64208120',
      complement: 'Apto 45',
      patient: {
        create: {
          name: 'João da Silva',
          birthDate: new Date('1990-01-01'),
          gender: 'M',
          race: 'MIXED',
          sus: '111112222233333',
          pathologies: {
            ...(pathology && {
              connect: {
                id: pathology.id,
              },
            }),
          },
        },
      },
    },
  });

  const unitMeasureMg = await prisma.unitMeasure.create({
    data: {
      name: 'miligrama',
      acronym: 'mg',
    },
  });

  const unitMeasureMl = await prisma.unitMeasure.create({
    data: {
      name: 'mililitro',
      acronym: 'ml',
    },
  });

  const pharmaceuticalFormComprimido = await prisma.pharmaceuticalForm.create({
    data: {
      name: 'Comprimido',
    },
  });

  const pharmaceuticalFormCapsula = await prisma.pharmaceuticalForm.create({
    data: {
      name: 'Cápsula',
    },
  });

  const therapeuticClasse01 = await prisma.therapeuticClass.create({
    data: {
      name: 'Analgésicos',
    },
  });

  const medicine1 = await prisma.medicine.create({
    data: {
      name: 'Paracetamol',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse01.id,
        },
      },
    },
  });

  await prisma.movementType.createMany({
    data: [
      {
        name: 'DOAÇÃO',
        direction: 'ENTRY',
      },
      {
        name: 'PERDA/ROUBO/FURTO',
        direction: 'EXIT',
      },
    ],
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMl.id,
      },
      {
        dosage: '750',
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMl.id,
      },
    ],
  });

  const therapeuticClasse02 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anti-inflamatórios',
    },
  });

  const medicine2 = await prisma.medicine.create({
    data: {
      name: 'Ibuprofeno',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse02.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '200',
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '400',
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse03 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antibióticos',
    },
  });

  const medicine3 = await prisma.medicine.create({
    data: {
      name: 'Amoxicilina',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse03.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine3.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '750',
        medicineId: medicine3.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse04 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antifúngicos',
    },
  });

  const medicine4 = await prisma.medicine.create({
    data: {
      name: 'Fluconazol',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse04.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '150',
        medicineId: medicine4.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '300',
        medicineId: medicine4.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse05 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antivirais',
    },
  });

  const medicine5 = await prisma.medicine.create({
    data: {
      name: 'Oseltamivir',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse05.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '75',
        medicineId: medicine5.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '150',
        medicineId: medicine5.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse06 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anti-hipertensivos',
    },
  });

  const medicine6 = await prisma.medicine.create({
    data: {
      name: 'Losartana',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse06.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '50',
        medicineId: medicine6.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '100',
        medicineId: medicine6.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse07 = await prisma.therapeuticClass.create({
    data: {
      name: 'Hipoglicemiantes',
    },
  });

  const medicine7 = await prisma.medicine.create({
    data: {
      name: 'Metformina',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse07.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine7.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '850',
        medicineId: medicine7.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse08 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anticoagulantes',
    },
  });

  const medicine8 = await prisma.medicine.create({
    data: {
      name: 'Varfarina',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse08.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '2.5',
        medicineId: medicine8.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '5',
        medicineId: medicine8.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse09 = await prisma.therapeuticClass.create({
    data: {
      name: 'Ansiolíticos',
    },
  });

  const medicine9 = await prisma.medicine.create({
    data: {
      name: 'Diazepam',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse09.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '5',
        medicineId: medicine9.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '10',
        medicineId: medicine9.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });

  const therapeuticClasse10 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antidepressivos',
    },
  });

  const medicine10 = await prisma.medicine.create({
    data: {
      name: 'Fluoxetina',
      therapeuticClasses: {
        connect: {
          id: therapeuticClasse10.id,
        },
      },
    },
  });

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '20',
        medicineId: medicine10.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '40',
        medicineId: medicine10.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
