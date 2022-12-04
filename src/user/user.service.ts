import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDtio } from './dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDtio) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dto
      })

      delete user.password

      return { user }
    } catch (error) {
      throw error
    }
  }
}
