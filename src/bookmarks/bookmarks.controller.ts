import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { GetUser } from 'src/auth/decprator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @GetUser('id') userId:number,
    @Body() createBookmarkDto: CreateBookmarkDto
    ) {
    return this.bookmarksService.create(userId,createBookmarkDto);
  }

  @Get()
  findAll(@GetUser('id') userId:number) {
    return this.bookmarksService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId : number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarksService.findOne(userId,bookmarkId);
  }

  @Patch(':id')
  update(@GetUser('id') userId : number ,@Param('id',ParseIntPipe) bookmarkId: number, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarksService.update(userId, bookmarkId, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId : number,@Param('id',ParseIntPipe) bookmarkId: number) {
    return this.bookmarksService.remove(userId, bookmarkId);
  }
}
