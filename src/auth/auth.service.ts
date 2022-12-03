import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'src/prisma/prisma.service'
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
        return {
          statusCode: 401,
          message: 'Estas credenciais já estão em uso'
        }
      }
    }
  }

  async signin(dto: ICredentialsDTO) {
    const credentialsErrorMessage = 'Credenciais inválidas'

    try {
      const user = await this.prisma.user.findFirst({
        where: { email: dto.email }
      })

      if (!user) throw new Error(credentialsErrorMessage)

      const passwordMatches = await argon.verify(user.password, dto.password)

      if (!passwordMatches) throw new Error(credentialsErrorMessage)

      return this.signToken(user.id, user.email)
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
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
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    })

    return {
      access_token: token
    }
  }
}
