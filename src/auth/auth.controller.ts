import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { IAuthDTO, ICredentialsDTO } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: IAuthDTO) {
    return this.authService.signup(dto)
  }

  @Post('signin')
  signin(@Body() dto: ICredentialsDTO) {
    return this.authService.signin(dto)
  }
}
