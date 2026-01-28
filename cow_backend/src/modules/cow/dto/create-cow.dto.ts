import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCowDto {
  @IsNotEmpty({ message: 'O site é obrigatório' })
  @IsString({ message: 'O site deve ser uma string' })
  site: string;

  @IsNotEmpty({ message: 'A URL é obrigatória' })
  @IsString({ message: 'A URL deve ser uma string' })
  url: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsString({ message: 'O tipo deve ser uma string' })
  type: string;

  @IsOptional()
  @IsObject({ message: 'Os dados devem ser um objeto' })
  data?: Record<string, any>;
}
