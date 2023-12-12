import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';

@model({settings: {strict: false}})
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
  })
  fullName?: object;

  @property({
    type: 'array',
    itemType: 'string',
  })
  likendIDProject?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true
  })
  roles: string[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
