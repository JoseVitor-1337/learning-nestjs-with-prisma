import {
  ParseIntPipe,
  Param,
  Controller,
  Body,
  Get,
  Patch,
  UseGuards
} from '@nestjs/common'

import { IUser, User } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { EditUserDto } from './dto'
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
  async getUserById(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<void | IUser> {
    return await this.userService.getUserById(userId)
  }

  @Patch('')
  async editUser(@User('id') userId: number, @Body() dto: EditUserDto) {
    return await this.userService.editUser(userId, dto)
  }
}
