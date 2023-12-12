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
import {PreProject} from '../models';
import {PreProjectRepository} from '../repositories';

@authenticate('jwt')
export class PreProjectController {
  constructor(
    @repository(PreProjectRepository)
    public preProjectRepository: PreProjectRepository,
  ) { }

  @post('/pre-projects')
  @response(200, {
    description: 'PreProject model instance',
    content: {'application/json': {schema: getModelSchemaRef(PreProject)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreProject, {
            title: 'NewPreProject',

          }),
        },
      },
    })
    preProject: PreProject,
  ): Promise<PreProject> {
    return this.preProjectRepository.create(preProject);
  }

  @authorize({allowedRoles: ['admin']})
  @get('/pre-projects/count')
  @response(200, {
    description: 'PreProject model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PreProject) where?: Where<PreProject>,
  ): Promise<Count> {
    return this.preProjectRepository.count(where);
  }

  @authorize({allowedRoles: ['admin']})
  @get('/pre-projects')
  @response(200, {
    description: 'Array of PreProject model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PreProject, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PreProject) filter?: Filter<PreProject>,
  ): Promise<PreProject[]> {
    return this.preProjectRepository.find(filter);
  }


  @get('/pre-projects/{id}')
  @response(200, {
    description: 'PreProject model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PreProject, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PreProject, {exclude: 'where'}) filter?: FilterExcludingWhere<PreProject>
  ): Promise<PreProject> {
    return this.preProjectRepository.findById(id, filter);
  }

  @patch('/pre-projects/{id}')
  @response(204, {
    description: 'PreProject PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreProject, {partial: true}),
        },
      },
    })
    preProject: PreProject,
  ): Promise<void> {
    await this.preProjectRepository.updateById(id, preProject);
  }

  @put('/pre-projects/{id}')
  @response(204, {
    description: 'PreProject PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() preProject: PreProject,
  ): Promise<void> {
    await this.preProjectRepository.replaceById(id, preProject);
  }

  @del('/pre-projects/{id}')
  @response(204, {
    description: 'PreProject DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.preProjectRepository.deleteById(id);
  }
}
