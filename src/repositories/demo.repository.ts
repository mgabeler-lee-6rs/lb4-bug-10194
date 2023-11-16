import {inject, Getter} from '@loopback/core';
import { repository, HasOneRepositoryFactory, DefaultTransactionalRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Demo, DemoRelations, Friend} from '../models';
import {FriendRepository} from './friend.repository';

export class DemoRepository extends DefaultTransactionalRepository<
  Demo,
  typeof Demo.prototype.id,
  DemoRelations
> {

  public readonly friend: HasOneRepositoryFactory<Friend, typeof Demo.prototype.id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('FriendRepository') protected friendRepositoryGetter: Getter<FriendRepository>,
  ) {
    super(Demo, dataSource);
    this.friend = this.createHasOneRepositoryFactoryFor('friend', friendRepositoryGetter);
    this.registerInclusionResolver('friend', this.friend.inclusionResolver);
  }
}
