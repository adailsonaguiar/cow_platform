import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CowController } from './cow.controller';
import { CowService } from './cow.service';
import { CowRepository } from '../../repositories/cow.repository';
import { Cow, CowSchema } from '../../entities/cow.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cow.name, schema: CowSchema }])],
  controllers: [CowController],
  providers: [CowService, CowRepository],
  exports: [CowService, CowRepository],
})
export class CowModule {}
