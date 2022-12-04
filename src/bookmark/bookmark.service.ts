import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookmarkDto, EditBookmarkDto } from './dto'

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarkById(userId: number, bookmarkId: number) {
    try {
      return this.prisma.bookMark.findFirst({
        where: { userId, id: bookmarkId }
      })
    } catch (error) {
      return error
    }
  }

  getBookmarks(userId: number) {
    try {
      return this.prisma.bookMark.findMany({ where: { userId } })
    } catch (error) {
      return error
    }
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    try {
      const bookmark = await this.prisma.bookMark.create({
        data: { userId, ...dto }
      })

      return bookmark
    } catch (error) {
      throw error
    }
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto
  ) {
    const bookmark = await this.prisma.bookMark.findFirst({
      where: { id: bookmarkId }
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Acesso negado.')
    }

    return this.prisma.bookMark.update({
      where: { id: bookmarkId },
      data: dto
    })
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookMark.findFirst({
      where: { id: bookmarkId }
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Acesso negado.')
    }

    return this.prisma.bookMark.delete({
      where: { id: bookmarkId }
    })
  }
}
