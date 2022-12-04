import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module'

describe('App End-to-end', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    prisma = app.get(PrismaService)

    await app.init()
    await app.listen(3333)

    await prisma.cleanDatabase()

    pactum.request.setBaseUrl('http://localhost:3333')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Auth', () => {
    const dtp = {
      firstName: 'José',
      lastName: 'Vitor',
      email: 'Josevitor@gmail.com',
      password: '123'
    }

    describe('Signin', () => {
      const router = '/auth/signup'

      it('Should signup', () => {
        return pactum.spec().post(router).withBody(dtp).expectStatus(201)
      })

      it('Should throw error if email repeted', () => {
        return pactum.spec().post(router).withBody(dtp).expectStatus(400)
      })
    })

    describe('Sing In', () => {
      const router = '/auth/signin'

      it('Should signin', () => {
        return pactum
          .spec()
          .post(router)
          .withBody(dtp)
          .expectStatus(201)
          .stores('userAt', 'access_token')
      })

      it('Should throw error if email is wrong', () => {
        const credentials = {
          email: 'josé vitor',
          password: '123'
        }

        return pactum
          .spec()
          .post(router)
          .withBody(credentials)
          .expectStatus(400)
      })

      it('Should throw error if password is wrong', () => {
        const credentials = {
          email: '12345@gmail.com',
          password: '12345678'
        }

        return pactum
          .spec()
          .post(router)
          .withBody(credentials)
          .expectStatus(400)
      })
    })
  })

  describe('Users', () => {
    describe('Get me', () => {
      const router = '/users/me'

      it('Get throw unauthorized exception', () => {
        return pactum.spec().get(router).expectStatus(401)
      })

      it('Should get current user', () => {
        return pactum
          .spec()
          .get(router)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
      })
    })

    describe('Edit user ', () => {
      const router = '/users'

      it('Get throw unauthorized exception', () => {
        const dto = {
          firstName: 'Vitor',
          lastName: 'Gerônimo'
        }
        return pactum
          .spec()
          .patch(router)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
      })
    })
  })

  describe('Bookmars', () => {
    describe('Get empty bookmarks', () => {
      it('Should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('Create bookmark', () => {
      const bookmark = {
        title: 'Nestjs Course',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s'
      }

      it('Should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(bookmark)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    })

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })

    describe('Get bookmar k by Id', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .inspect()
          .expectBodyContains('$S{bookmarkId}')
      })
    })

    describe('Edit bookmark by Id', () => {
      it('Should edit bookmark by id', () => {
        const newBookmark = {
          description: 'video to learne nextjs'
        }

        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(newBookmark)
          .expectStatus(200)
          .expectBodyContains(newBookmark.description)
          .inspect()
      })
    })

    describe('Delete bookmark by Id', () => {
      it('Should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204)
          .inspect()
      })

      it('Should get empty bookmars after delete', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(0)
      })
    })
  })
})
