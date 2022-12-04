import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const primaclientOptions: PrismaClientOptions = {
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    }

    super(primaclientOptions)
  }

  async cleanDatabase() {
    return await this.$transaction([
      this.bookMark.deleteMany(),
      this.user.deleteMany()
    ])
  }
}
