import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CowService } from './cow.service';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';

@Controller('cows')
export class CowController {
  constructor(private readonly cowService: CowService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCowDto: CreateCowDto) {
    return this.cowService.create(createCowDto);
  }

  @Get()
  findAll(
    @Query('site') site?: string,
    @Query('type') type?: string,
    @Query('url') url?: string,
  ) {
    console.log(
      `Query params recebidos - site: ${site}, type: ${type}, url: ${url}`,
    );
    if (url && type) {
      return this.cowService.findByUrlAndType(url, type);
    }
    if (site) {
      return this.cowService.findBySite(site);
    }
    if (type) {
      return this.cowService.findByType(type);
    }

    if (url) {
      return this.cowService.findByUrl(url);
    }

    return this.cowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cowService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCowDto: UpdateCowDto) {
    return this.cowService.update(id, updateCowDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cowService.remove(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll() {
    return this.cowService.removeAll();
  }
}
