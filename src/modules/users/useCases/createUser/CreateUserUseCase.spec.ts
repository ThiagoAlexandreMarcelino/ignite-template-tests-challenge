import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"



describe("Create User", ()=>{

let userRepositoryInMemory:  InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

beforeEach(()=>{

    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
})

it("Shoul be able to creat a new user", async ()=>{

   const createdUser = await createUserUseCase.execute({
        name: "User 1",
        email: "user1@teste.com.br",
        password:"1234"
    })

    // console.log(createdUser)

    expect(createdUser).toHaveProperty("id")

})
})
