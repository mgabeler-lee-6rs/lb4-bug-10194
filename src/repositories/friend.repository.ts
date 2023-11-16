import {inject} from '@loopback/core';
import { DefaultTransactionalRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Friend, FriendRelations} from '../models';

export class FriendRepository extends DefaultTransactionalRepository<
  Friend,
  typeof Friend.prototype.id,
  FriendRelations
> {
  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
  ) {
    super(Friend, dataSource);
  }
}
