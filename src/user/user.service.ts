import { Injectable } from '@nestjs/common'
import { EditUserDto } from './dto'
import { UserRepository } from './user.respository'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async editUser(userId: number, dto: EditUserDto) {
    return this.userRepository.update(userId, dto)
  }

  async getUsers() {
    return this.userRepository.findMany()
  }

  async getUserById(userId: number) {
    return this.userRepository.findOneById(userId)
  }
}
