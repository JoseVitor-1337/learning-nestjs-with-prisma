import { Controller, Body, Get, Patch, UseGuards } from '@nestjs/common'

import { IUser, User } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { EditUserDtio } from './dto'
import { UserService } from './user.service'

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@User() user: IUser): Promise<IUser> {
    return user
  }

  @Get('')
  async getUsers(): Promise<IUser[]> {
    return await this.userService.getUsers()
  }

  @Get(':id')
  async getUserById(@User('') userId: number): Promise<IUser> {
    return await this.userService.getUserById(userId)
  }

  @Patch()
  async editUser(@User('id') userId: number, @Body() dto: EditUserDtio) {
    return await this.userService.editUser(userId, dto)
  }
}
