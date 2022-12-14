import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto, FilterUserDto } from './dto'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(userFilterQuery?: FilterUserDto): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { ...userFilterQuery } })
  }

  async findOneById(userId: number): Promise<void | User> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } })

    console.log('user', user)

    if (!user) throw new BadRequestException('Usuários não encontrado')
  }

  async update(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto
    })

    delete user.password

    return user
  }
}
