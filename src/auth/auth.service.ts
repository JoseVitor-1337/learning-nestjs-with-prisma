import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { IAuthDTO, ICredentialsDTO } from './dto'
import * as argon from 'argon2'

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: IAuthDTO) {
    const hash = await argon.hash(dto.password)

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hash
        }
      })

      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Estas credenciais já estão em uso')
      }

      throw error
    }
  }

  async signin(dto: ICredentialsDTO) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: dto.email }
      })

      if (!user) throw new BadRequestException('Email errado')

      const passwordMatches = await argon.verify(user.password, dto.password)

      if (!passwordMatches) throw new BadRequestException('Password errado')

      return this.signToken(user.id, user.email)
    } catch (error) {
      throw error
    }
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    }

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET')
    })

    return {
      access_token: token
    }
  }
}
