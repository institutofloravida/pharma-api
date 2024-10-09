# PHARMA API | INTITUTO FLORA VIDA

## RFs (Requisitos Funcionais)

- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível esquecer a senha;
- [ ] Deve ser possível obter o perfil de um usuário logado;

- [ ] Deve ser possível associar uma instituição a um estoque;
- [ ] Deve ser possível associar uma instituição a um operador; 

- ✅ Deve ser possível cadastrar um medicamento;
- ✅ Deve ser possível cadastrar um fabricante;
- ✅ Deve ser possível cadastrar uma unidade de medida;
- ✅ Deve ser possível cadastrar uma classe terapeutica;
- ✅ Deve ser possível cadastrar um estoque;
- ✅ Deve ser possível cadastrar um operador;
- ✅ Deve ser possível cadastrar uma forma farmacêutica;
- ✅ Deve ser possível cadastrar uma instituição;
- [ ] Deve ser possível cadastrar um lote de medicamentos;
- [ ] Deve ser possível cadastrar um usuário(pessoa que recebe o medicamento);

- [ ] Deve ser possível visualizar alertas de medicamentos a vencer
- [ ] Deve ser possível realizar a dispensação de um medicamento(FEFO);
- [ ] Deve ser possível registrar o recebimento de medicamentos;
- [ ] deve ser possível registrar a saída de medicamentos
- [ ] deve ser possível inventariar um estoque


  ### relatótórios
  - []

## RNs (Regras de negócio)

- [ ] não podem haver dois operadores com o mesmo email;
- [ ] O sistema deve respeitar os níveis de permissão dos operadores (RBAC); 
- [ ] Um operador só pode ser cadastrado por um operador com permissão administrador;
- [ ] O sistema não deve permitir a dispensação de um medicamento vencido;


## RNFs (Requisitos não-functionais)

- [ ]  A senha dos operadores precisam estar criptografada;
- [ ]  Os dados da aplicação precisam estar persistidos em um banco PostgresSQL; 
- [ ]  O usuário deve ser identificado por um JWT (JSON Web Token);
