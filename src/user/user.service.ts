import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { EditUserDto } from './dto'
import { UserRepository } from './user.respository'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    return this.userRepository.update(userId, dto)
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findMany()
  }

  async getUserById(userId: number): Promise<User> {
    return this.userRepository.findOneById(userId)
  }
}
