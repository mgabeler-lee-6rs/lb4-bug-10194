import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';
import { DemoRepository, FriendRepository } from '../repositories';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(DemoRepository) private demoRepo: DemoRepository,
    @repository(FriendRepository) private friendRepo: FriendRepository,
  ) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  async ping(): Promise<object> {
    // demo the bug
    const transaction = await this.demoRepo.beginTransaction();
    try {
      const demo1 = await this.demoRepo.create({ id: '1', name: 'one' }, { transaction });
      const friend1 = await this.friendRepo.create({ id: '2', name: 'two', demoId: demo1.id }, { transaction });
      const queriedDemo = await this.demoRepo.findById(demo1.id, { include: [{ relation: 'friend' }] }, { transaction });
      if (!queriedDemo.friend) {
        throw new Error('where did my friend go?!')
      }
    } finally {
      await transaction.rollback();
    }

    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
