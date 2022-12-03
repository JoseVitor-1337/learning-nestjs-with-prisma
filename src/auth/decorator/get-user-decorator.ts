import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User as IUserType } from '@prisma/client'
import { Request } from 'express'

export type IUser = IUserType

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()
    if (data) return request.user[data]
    return request.user
  }
)
