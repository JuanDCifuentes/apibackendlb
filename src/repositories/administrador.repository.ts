import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoProyectOneDataSource} from '../datasources';
import {Administrador, AdministradorRelations} from '../models';

export class AdministradorRepository extends DefaultCrudRepository<
  Administrador,
  typeof Administrador.prototype.idAdmin,
  AdministradorRelations
> {
  constructor(
    @inject('datasources.MongoProyectOne') dataSource: MongoProyectOneDataSource,
  ) {
    super(Administrador, dataSource);
  }
}
