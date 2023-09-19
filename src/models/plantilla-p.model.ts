import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PlantillaP extends Entity {
  @property({
    type: 'object',
    required: true,
  })
  idPlatilla: object;

  @property({
    type: 'array',
    itemType: 'object',
  })
  items?: object[];

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
