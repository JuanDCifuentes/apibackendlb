import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PlantillaP extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idPlatilla?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  items?: object[];

  @property({
    type: 'string',
  })
  nombrePlatilla?: string;

  @property({
    type: 'number'
  })
  version?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PlantillaP>) {
    super(data);
  }
}

export interface PlantillaPRelations {
  // describe navigational properties here
}

export type PlantillaPWithRelations = PlantillaP & PlantillaPRelations;
