import {
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Body,
  Param,
  Post,
  Delete,
  Patch,
  Get,
  UseGuards,
  Controller
} from '@nestjs/common'
import { User } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { BookmarkService } from './bookmark.service'
import { EditBookmarkDto, CreateBookmarkDto } from './dto'

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get(':id')
  getBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId)
  }

  @Get()
  getBookmarks(@User('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId)
  }

  @Post()
  createBookmark(@User('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto)
  }

  @Patch(':id')
  editBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
  }
}
