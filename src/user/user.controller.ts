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
  getMe(@User() user: IUser) {
    return { user }
  }

  @Patch()
  async editUser(@User('id') userId: number, @Body() dto: EditUserDtio) {
    return await this.userService.editUser(userId, dto)
  }
}
