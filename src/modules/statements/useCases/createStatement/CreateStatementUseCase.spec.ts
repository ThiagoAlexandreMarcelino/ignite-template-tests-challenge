import { rejects } from "assert"
import { type } from "os"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "../../../users/useCases/showUserProfile/ShowUserProfileUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


describe("Create Statments",()=>{

  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let authenticateUserUseCase: AuthenticateUserUseCase
  let inMemoryStatementsRepository: InMemoryStatementsRepository
  let createStatementUseCase: CreateStatementUseCase


  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should be able to create a deposit", async ()=>{

    const userData: ICreateUserDTO = {
      name:"Usuario Teste Deposito",
      email:"usuariodeposita@teste.com",
      password:"1234",
    }

    const { id: user_id } = await createUserUseCase.execute(userData)

    const deposit = await createStatementUseCase.execute({
      description:"Salario",
      user_id: user_id as string,
      amount:500,
      type: "deposit" as OperationType

    })


    expect(deposit).toHaveProperty("id")
    expect(deposit.type).toEqual("deposit")
})

it("Should be able to create an withdraw ", async ()=>{

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
    description:"Salario",
    user_id: user_id as string,
    amount:300,
    type: "withdraw" as OperationType

  })

  expect(withdraw).toHaveProperty("id")
  expect(withdraw.type).toEqual("withdraw")
})

it("Should not be able to create an withdraw when the funds was insuficient ", async ()=>{

  const userData: ICreateUserDTO = {
    name:"Usuario Teste Deposito",
    email:"usuariodeposita@teste.com",
    password:"1234",
  }

  const { id: user_id } = await createUserUseCase.execute(userData)


  expect( async ()=>{
    const withdraw = await createStatementUseCase.execute({
      description:"gasto teste",
      user_id: user_id as string,
      amount:300,
      type: "withdraw" as OperationType

    })

  }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)


})

it("Should not be able to create an statment for unexistent user", async ()=>{


  expect( async ()=>{
    const withdraw = await createStatementUseCase.execute({
      description:"gasto teste",
      user_id: "123456",
      amount:300,
      type: "withdraw" as OperationType

    })

  }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

})


})
