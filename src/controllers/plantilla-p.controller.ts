import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {PlantillaP} from '../models';
import {PlantillaPRepository} from '../repositories';

@authenticate('jwt')

export class PlantillaPController {
  constructor(
    @repository(PlantillaPRepository)
    public plantillaPRepository: PlantillaPRepository,
  ) { }

  @authorize({allowedRoles: ['admin']})
  @post('/plantilla-ps')
  @response(200, {
    description: 'PlantillaP model instance',
    content: {'application/json': {schema: getModelSchemaRef(PlantillaP)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlantillaP, {
            title: 'NewPlantillaP',

          }),
        },
      },
    })
    plantillaP: PlantillaP,
  ): Promise<PlantillaP> {
    return this.plantillaPRepository.create(plantillaP);
  }


  @authorize({allowedRoles: ['admin']})
  @get('/plantilla-ps/count')
  @response(200, {
    description: 'PlantillaP model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PlantillaP) where?: Where<PlantillaP>,
  ): Promise<Count> {
    return this.plantillaPRepository.count(where);
  }


  @get('/plantilla-ps')
  @response(200, {
    description: 'Array of PlantillaP model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PlantillaP, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PlantillaP) filter?: Filter<PlantillaP>,
  ): Promise<PlantillaP[]> {
    return this.plantillaPRepository.find(filter);
  }

  @authorize({allowedRoles: ['admin']})
  @patch('/plantilla-ps')
  @response(200, {
    description: 'PlantillaP PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlantillaP, {partial: true}),
        },
      },
    })
    plantillaP: PlantillaP,
    @param.where(PlantillaP) where?: Where<PlantillaP>,
  ): Promise<Count> {
    return this.plantillaPRepository.updateAll(plantillaP, where);
  }


  @get('/plantilla-ps/{id}')
  @response(200, {
    description: 'PlantillaP model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PlantillaP, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PlantillaP, {exclude: 'where'}) filter?: FilterExcludingWhere<PlantillaP>
  ): Promise<PlantillaP> {
    return this.plantillaPRepository.findById(id, filter);
  }

  @authorize({allowedRoles: ['admin']})
  @patch('/plantilla-ps/{id}')
  @response(204, {
    description: 'PlantillaP PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlantillaP, {partial: true}),
        },
      },
    })
    plantillaP: PlantillaP,
  ): Promise<void> {
    await this.plantillaPRepository.updateById(id, plantillaP);
  }

  @authorize({allowedRoles: ['admin']})
  @put('/plantilla-ps/{id}')
  @response(204, {
    description: 'PlantillaP PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() plantillaP: PlantillaP,
  ): Promise<void> {
    await this.plantillaPRepository.replaceById(id, plantillaP);
  }

  @authorize({allowedRoles: ['admin']})
  @del('/plantilla-ps/{id}')
  @response(204, {
    description: 'PlantillaP DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.plantillaPRepository.deleteById(id);
  }
}
