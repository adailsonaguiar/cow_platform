import { Injectable, NotFoundException } from '@nestjs/common';
import { CowRepository } from '../../repositories/cow.repository';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { Cow } from '../../entities/cow.entity';

@Injectable()
export class CowService {
  constructor(private readonly cowRepository: CowRepository) {}

  async create(createCowDto: CreateCowDto): Promise<Cow> {
    return this.cowRepository.create(createCowDto);
  }

  async findAll(): Promise<Cow[]> {
    return this.cowRepository.findAll();
  }

  async findOne(id: string): Promise<Cow> {
    const cow = await this.cowRepository.findById(id);
    if (!cow) {
      throw new NotFoundException(`Cow com ID ${id} não encontrada`);
    }
    return cow;
  }

  async findBySite(site: string): Promise<Cow[]> {
    return this.cowRepository.findBySite(site);
  }

  async findByType(type: string): Promise<Cow[]> {
    return this.cowRepository.findByType(type);
  }

  async findBySiteUrl(url: string): Promise<Cow | null> {
    console.log(`Buscando Cow por Site URL: ${url}`);
    return this.cowRepository.findBySiteUrl(url);
  }

  async update(id: string, updateCowDto: UpdateCowDto): Promise<Cow> {
    const cow = await this.cowRepository.update(id, updateCowDto);
    if (!cow) {
      throw new NotFoundException(`Cow com ID ${id} não encontrada`);
    }
    return cow;
  }

  async remove(id: string): Promise<void> {
    const cow = await this.cowRepository.delete(id);
    if (!cow) {
      throw new NotFoundException(`Cow com ID ${id} não encontrada`);
    }
  }

  async removeAll(): Promise<void> {
    await this.cowRepository.deleteAll();
  }

  async findByUrlAndType(url: string, type: string): Promise<Cow | null> {
    console.log(`Buscando Cow por URL e Tipo: ${url}, ${type}`);
    return this.cowRepository.findByUrlAndType(url, type);
  }
}
