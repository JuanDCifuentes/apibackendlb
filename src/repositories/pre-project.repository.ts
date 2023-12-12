import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoProyectOneDataSource} from '../datasources';
import {PreProject, PreProjectRelations, Users} from '../models';
import {UsersRepository} from './users.repository';

export class PreProjectRepository extends DefaultCrudRepository<
  PreProject,
  typeof PreProject.prototype.idPreProject,
  PreProjectRelations
> {

  public readonly users: HasManyRepositoryFactory<Users, typeof PreProject.prototype.id>;

  constructor(
    @inject('datasources.MongoProyectOne') dataSource: MongoProyectOneDataSource, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(PreProject, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', usersRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
