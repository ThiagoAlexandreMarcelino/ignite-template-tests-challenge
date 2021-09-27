import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"



describe("Show user profile", ()=>{


  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let authenticateUserUseCase: AuthenticateUserUseCase
  let showUserProfileUseCase: ShowUserProfileUseCase


  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to show infos of a authenticated user", async()=>{

    const user: ICreateUserDTO ={
      name: "Teste 2",
      email: "teste2@teste.com.br",
      password: "1234"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    const id = result.user.id as string

    const userRetorned = await showUserProfileUseCase.execute(id)

    // console.log(userRetorned)


  });


  })

