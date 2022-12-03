import { Controller, Get, UseGuards } from '@nestjs/common'

import { IUser, User } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@User() user: IUser) {
    return { user }
  }
}
