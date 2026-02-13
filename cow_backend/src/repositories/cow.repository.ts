import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cow, CowDocument } from '../entities/cow.entity';

@Injectable()
export class CowRepository {
  constructor(@InjectModel(Cow.name) private cowModel: Model<CowDocument>) {}

  async create(cowData: Partial<Cow>): Promise<Cow> {
    const newCow = new this.cowModel(cowData);
    return newCow.save();
  }

  async findAll(): Promise<Cow[]> {
    return this.cowModel.find().exec();
  }

  async findById(id: string): Promise<Cow | null> {
    return this.cowModel.findById(id).exec();
  }

  async findBySite(site: string): Promise<Cow[]> {
    return this.cowModel.find({ site }).exec();
  }

  async findByType(type: string): Promise<Cow[]> {
    return this.cowModel.find({ type }).exec();
  }

  async findBySiteUrl(siteUrl: string): Promise<Cow | null> {
    // Remove query params e hash da URL
    let normalizedUrl = siteUrl.split('?')[0].split('#')[0];
    // Remove barra final se existir para normalizar a URL de busca
    normalizedUrl = normalizedUrl.replace(/\/+$/, '');
    // Escapa caracteres especiais da URL para uso em regex
    const escapedUrl = normalizedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Busca URLs que correspondam com ou sem barra final
    // O padrão permite que a URL esteja em qualquer posição da lista separada por vírgula
    // Usa word boundary (início da string, vírgula ou espaço) antes e depois da URL
    return this.cowModel
      .findOne({
        sites: new RegExp('(^|,\\s*)' + escapedUrl + '\\/?($|\\s*,)', 'i'),
        active: true,
      })
      .exec();
  }

  async update(id: string, cowData: Partial<Cow>): Promise<Cow | null> {
    return this.cowModel.findByIdAndUpdate(id, cowData, { new: true }).exec();
  }

  async delete(id: string): Promise<Cow | null> {
    return this.cowModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<any> {
    return this.cowModel.deleteMany({}).exec();
  }

  async findByUrlAndType(url: string, type: string): Promise<Cow | null> {
    return this.cowModel.findOne({ url, type }).exec();
  }
}
