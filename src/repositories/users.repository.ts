import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoProyectOneDataSource} from '../datasources';
import {UserCredentials, Users, UsersRelations} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';

export type Credentials = {
  email: string;
  password: string;
}

export type UserData = {
  email: string;
  password: string;
  roles: any[];
}

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.MongoProyectOne') dataSource: MongoProyectOneDataSource, @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(Users, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredencials(
    userId: typeof Users.prototype.id
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get()
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
