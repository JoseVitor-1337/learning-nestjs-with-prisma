import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserRepository } from './user.respository'
import { UserService } from './user.service'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
