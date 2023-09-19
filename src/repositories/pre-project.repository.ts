import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoProyectOneDataSource} from '../datasources';
import {PreProject, PreProjectRelations} from '../models';

export class PreProjectRepository extends DefaultCrudRepository<
  PreProject,
  typeof PreProject.prototype.idPreProject,
  PreProjectRelations
> {
  constructor(
    @inject('datasources.MongoProyectOne') dataSource: MongoProyectOneDataSource,
  ) {
    super(PreProject, dataSource);
  }
}
