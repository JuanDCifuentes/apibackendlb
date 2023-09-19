import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PreProject extends Entity {
  @property({
    type: 'object',
    required: true,
  })
  id: object;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    default: "no hay descripcion",
  })
  descripcion?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  items?: object[];

  @property({
    type: 'object',
  })
  infoProject?: object;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PreProject>) {
    super(data);
  }
}

export interface PreProjectRelations {
  // describe navigational properties here
}

export type PreProjectWithRelations = PreProject & PreProjectRelations;
