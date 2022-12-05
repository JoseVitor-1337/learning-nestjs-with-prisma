import { userStub } from '../test/stubs'

export const MockUserService = {
  getUserById: jest.fn().mockResolvedValue(userStub()),
  getUsers: jest.fn().mockResolvedValue([userStub()]),
  editUser: jest.fn().mockResolvedValue(userStub())
}
