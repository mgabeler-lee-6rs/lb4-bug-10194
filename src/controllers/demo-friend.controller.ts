import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Demo,
  Friend,
} from '../models';
import {DemoRepository} from '../repositories';

export class DemoFriendController {
  constructor(
    @repository(DemoRepository) protected demoRepository: DemoRepository,
  ) { }

  @get('/demos/{id}/friend', {
    responses: {
      '200': {
        description: 'Demo has one Friend',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Friend),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Friend>,
  ): Promise<Friend> {
    return this.demoRepository.friend(id).get(filter);
  }

  @post('/demos/{id}/friend', {
    responses: {
      '200': {
        description: 'Demo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Friend)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Demo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {
            title: 'NewFriendInDemo',
            exclude: ['id'],
            optional: ['demoId']
          }),
        },
      },
    }) friend: Omit<Friend, 'id'>,
  ): Promise<Friend> {
    return this.demoRepository.friend(id).create(friend);
  }

  @patch('/demos/{id}/friend', {
    responses: {
      '200': {
        description: 'Demo.Friend PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {partial: true}),
        },
      },
    })
    friend: Partial<Friend>,
    @param.query.object('where', getWhereSchemaFor(Friend)) where?: Where<Friend>,
  ): Promise<Count> {
    return this.demoRepository.friend(id).patch(friend, where);
  }

  @del('/demos/{id}/friend', {
    responses: {
      '200': {
        description: 'Demo.Friend DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Friend)) where?: Where<Friend>,
  ): Promise<Count> {
    return this.demoRepository.friend(id).delete(where);
  }
}
