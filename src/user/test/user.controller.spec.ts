import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'

import { UserController } from '../user.controller'
import { UserService } from '../user.service'
import { MockUserService } from '../__mocks__'
import { userStub } from './stubs'

describe('UsersController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService
        }
      ]
    }).compile()

    userService = await moduleRef.resolve<UserService>(UserService)
    userController = await moduleRef.resolve<UserController>(UserController)
  })

  describe('Get user by id', () => {
    describe('When getUserById() is called', () => {
      let user: User

      beforeEach(async () => {
        user = await userController.getUserById(userStub().id)
      })

      it('then should call by userService', () => {
        expect(userService.getUserById).toBeCalledWith(userStub().id)
      })

      it('then it should return a similar user', () => {
        expect(user.firstName).toEqual(userStub().firstName)
        expect(user.lastName).toEqual(userStub().lastName)
      })
    })
  })

  describe('Get users', () => {
    describe('When getUses() is called', () => {
      let users: User[]

      beforeEach(async () => {
        users = await userController.getUsers()
      })

      it('then should call by userService', () => {
        expect(userService.getUsers).toBeCalledTimes(1)
      })

      it('then it should return a similar user', () => {
        expect(users[0].firstName).toEqual(userStub().firstName)
        expect(users[0].lastName).toEqual(userStub().lastName)
      })
    })
  })

  describe('Edit user', () => {
    describe('When editUser() is called', () => {
      let user: User

      const newUser = userStub({
        firstName: 'Matheus',
        lastName: 'Vinícius'
      })

      beforeEach(async () => {
        user = await userController.editUser(newUser.id, newUser)
      })

      it('then should call by userService', () => {
        expect(userService.editUser).toBeCalledTimes(1)
      })

      it('then should call with some parameters', () => {
        expect(userService.editUser).toHaveBeenCalledWith(newUser.id, newUser)
      })

      it('then it should return a user', () => {
        expect(user.firstName).toEqual(userStub().firstName)
        expect(user.lastName).toEqual(userStub().lastName)
      })
    })
  })
})
