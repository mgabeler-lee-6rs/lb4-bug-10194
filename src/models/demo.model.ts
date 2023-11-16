import {Entity, model, property, hasOne} from '@loopback/repository';
import {Friend} from './friend.model';

@model()
export class Demo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasOne(() => Friend)
  friend: Friend;

  constructor(data?: Partial<Demo>) {
    super(data);
  }
}

export interface DemoRelations {
  // describe navigational properties here
}

export type DemoWithRelations = Demo & DemoRelations;
