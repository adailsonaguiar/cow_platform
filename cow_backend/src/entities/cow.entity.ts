import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CowDocument = Cow & Document;

@Schema({ collection: 'cows', timestamps: true })
export class Cow {
  @Prop({ required: true })
  sites: string;

  @Prop({ required: true })
  blockName: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Object, required: false })
  data?: Record<string, any>;

  @Prop({ default: true })
  active: boolean;
}

export const CowSchema = SchemaFactory.createForClass(Cow);
