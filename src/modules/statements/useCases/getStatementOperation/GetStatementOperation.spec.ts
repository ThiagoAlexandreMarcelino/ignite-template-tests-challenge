import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"



describe("Get Statement Operation",()=>{


  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let authenticateUserUseCase: AuthenticateUserUseCase
  let inMemoryStatementsRepository: InMemoryStatementsRepository
  let createStatementUseCase: CreateStatementUseCase
  let getStatementOperation: GetStatementOperationUseCase


  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should be able to get an statement", async ()=>{

    const userData: ICreateUserDTO = {
      name:"Usuario Teste Deposito",
      email:"usuariodeposita@teste.com",
      password:"1234",
    }

    const { id: user_id } = await createUserUseCase.execute(userData)

    const {id}= await createStatementUseCase.execute({
      description:"Salario",
      user_id: user_id as string,
      amount:500,
      type: "deposit" as OperationType

    })

    await getStatementOperation.execute({user_id:user_id as string,statement_id:id as string})


})

it("Should not be able to get an statement for an unexistents user",()=>{

  expect(async()=>{
    await getStatementOperation.execute({user_id:"111111" as string,statement_id:"222222222" as string})
  }).rejects.toBeInstanceOf(GetStatementOperationError)


})

})
