import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoProyectOneDataSource} from '../datasources';
import {PlantillaP, PlantillaPRelations} from '../models';

export class PlantillaPRepository extends DefaultCrudRepository<
  PlantillaP,
  typeof PlantillaP.prototype.idPlantilla,
  PlantillaPRelations
> {
  constructor(
    @inject('datasources.MongoProyectOne') dataSource: MongoProyectOneDataSource,
  ) {
    super(PlantillaP, dataSource);
  }
}
