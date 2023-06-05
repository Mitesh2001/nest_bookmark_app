import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarksService {

  constructor(private prisma : PrismaService) {}

  async create(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });

    return bookmark;
  }


  async findAll(userId : number) {

    const bookmarks = await this.prisma.bookmark.findMany({
      where : {
        userId
      }
    })

    return bookmarks;
  }

  async findOne(userId : number, bookmarkId: number) {

    const bookmark = await this.prisma.bookmark.findFirst({
      where : {
        id : bookmarkId,
        userId
      },
    })

    return bookmark;
  }

  async update(userId :number ,bookmarkId: number, updateBookmarkDto: UpdateBookmarkDto) {

    const bookmark = await this.prisma.bookmark.findUnique({
      where : {
        id : bookmarkId
      },
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.bookmark.update({
      where : {
        id : bookmarkId
      },
      data : {
        ...updateBookmarkDto
      }
    });

  }

  async remove(userId: number, bookmarkId : number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where : {
        id : bookmarkId
      },
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.bookmark.delete({
      where : {
        id : bookmarkId
      }
    })
  }

}
