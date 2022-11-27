import { Injectable } from '@nestjs/common'

@Injectable({})
export class AuthService {
  signup() {
    return { message: 'Sign Up' }
  }
  signin() {
    return { message: 'Sign In' }
  }
}
