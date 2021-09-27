import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"



describe("Authenticate user", ()=>{

  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let authenticateUserUseCase: AuthenticateUserUseCase

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

  })

  it("Should be able to authenticate a user", async ()=>{

    const user: ICreateUserDTO ={
      name: "Teste 1",
      email: "teste@teste.com.br",
      password: "123456"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })


    expect(result).toHaveProperty("token")

  });
})
