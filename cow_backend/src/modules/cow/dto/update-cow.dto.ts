import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateCowDto {
  @IsOptional()
  @IsString({ message: 'Os sites devem ser uma string' })
  sites?: string;

  @IsOptional()
  @IsString({ message: 'O nome do bloco deve ser uma string' })
  blockName?: string;

  @IsOptional()
  @IsString({ message: 'O tipo deve ser uma string' })
  type?: string;

  @IsOptional()
  @IsObject({ message: 'Os dados devem ser um objeto' })
  data?: Record<string, any>;

  @IsOptional()
  active?: boolean;
}
