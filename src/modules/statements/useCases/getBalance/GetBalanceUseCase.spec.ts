import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase, IRequest } from "./GetBalanceUseCase"


describe("Get Balance",()=>{

  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let inMemoryStatementsRepository: InMemoryStatementsRepository
  let createStatementUseCase: CreateStatementUseCase
  let getBalanceUseCase: GetBalanceUseCase


  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)


    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })


it("Should be able to  get the balance ", async ()=>{

  const userData: ICreateUserDTO = {
    name:"Usuario Teste Deposito",
    email:"usuariodeposita@teste.com",
    password:"1234",
  }

  const { id: user_id } = await createUserUseCase.execute(userData)

  await createStatementUseCase.execute({
    description:"Salario",
    user_id: user_id as string,
    amount:500,
    type: "deposit" as OperationType

  })

  const withdraw = await createStatementUseCase.execute({
    description:"Despesa",
    user_id: user_id as string,
    amount:300,
    type: "withdraw" as OperationType

  })

  const result = await getBalanceUseCase.execute({user_id: user_id as string})

  // console.log(result)

  expect(result.statement.length).toEqual(2)
  expect(result).toHaveProperty("balance")
})

it("Shoul not be able to any get balance if the user does not exist", async()=>{

  expect(async()=>{

    await getBalanceUseCase.execute({user_id: "12345" as string})
  }).rejects.toBeInstanceOf(GetBalanceError)
})

})
