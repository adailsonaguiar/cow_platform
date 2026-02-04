import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCowDto {
  @IsNotEmpty({ message: 'Os sites são obrigatórios' })
  @IsString({ message: 'Os sites devem ser uma string' })
  sites: string;

  @IsNotEmpty({ message: 'O nome do bloco é obrigatório' })
  @IsString({ message: 'O nome do bloco deve ser uma string' })
  blockName: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsString({ message: 'O tipo deve ser uma string' })
  type: string;

  @IsOptional()
  @IsObject({ message: 'Os dados devem ser um objeto' })
  data?: Record<string, any>;
}
