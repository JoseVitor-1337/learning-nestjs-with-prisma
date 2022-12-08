import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../../prisma/prisma.service'
import * as request from 'supertest'
import { AppModule } from '../../../app.module'
import { userStub } from '../stubs'

describe('UsersController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let httpServer: string
  let authorizationToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()

    prisma = app.get<PrismaService>(PrismaService)

    httpServer = app.getHttpServer()

    prisma.cleanDatabase()

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userStub())

    authorizationToken = `Bearer ${response.body.access_token}`
  })

  afterAll(async () => {
    await app.close()
  })

  describe('getUsers()', () => {
    it('Should throw unauthorazed error', async () => {
      const response = await request(httpServer).get('/users')

      expect(response.status).toBe(401)
    })

    it('Should get users', async () => {
      const response = await request(httpServer)
        .get('/users')
        .set('Authorization', authorizationToken)

      const { email, password } = response.body[0]

      expect(response.body).toHaveLength(1)
      expect(response.status).toBe(200)
      expect(email).toEqual(userStub().email)
      expect(password).not.toEqual(userStub().password)
    })
  })

  describe('getMe()', () => {
    it('Should throw unauthorazed error', async () => {
      const response = await request(httpServer).get('/users/me')

      expect(response.status).toBe(401)
    })

    it('Should get me', async () => {
      const response = await request(httpServer)
        .get('/users/me')
        .set('Authorization', authorizationToken)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('createdAt')
      expect(response.body).toHaveProperty('updatedAt')
    })
  })

  describe('editUser()', () => {
    it('Should throw unauthorazed error', async () => {
      const response = await request(httpServer).patch('/users')

      expect(response.status).toBe(401)
    })

    it('Should edit  auser', async () => {
      const newUser = {
        firstName: 'Vitor',
        lastName: 'Matheus'
      }

      const response = await request(httpServer)
        .patch('/users')
        .send(newUser)
        .set('Authorization', authorizationToken)

      expect(response.status).toBe(200)
      expect(response.body.firstName).toBe(newUser.firstName)
      expect(response.body.lastName).toBe(newUser.lastName)
    })
  })
})
