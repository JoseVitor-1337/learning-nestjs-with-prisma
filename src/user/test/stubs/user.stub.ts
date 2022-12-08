import { User } from '@prisma/client'

type IPartialUser = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export const userStub = (customFields: IPartialUser = {}): User => {
  const generatedUser = {
    id: 1000,
    firstName: 'José',
    lastName: 'Vitor',
    email: 'Josevitor@gmail.com',
    password: '123',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return { ...generatedUser, ...customFields }
}
