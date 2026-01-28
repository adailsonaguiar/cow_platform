import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateCowDto {
  @IsOptional()
  @IsString({ message: 'O site deve ser uma string' })
  site?: string;

  @IsOptional()
  @IsString({ message: 'A URL deve ser uma string' })
  url?: string;

  @IsOptional()
  @IsString({ message: 'O tipo deve ser uma string' })
  type?: string;

  @IsOptional()
  @IsObject({ message: 'Os dados devem ser um objeto' })
  data?: Record<string, any>;
}
