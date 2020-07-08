import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { QueryParserService } from '../common/helper/query-parser-service';
import { getModuleHttp } from '../common/helper/basic-function';
import { UserDbService } from '../common/db/table.db.service';

/**
 * Module for user
 *
 * @export
 * @class UserModule
 */
@Module({
  controllers: [],
  providers: [
    UserService,
    UserDbService,
    QueryParserService
  ],
  imports: [getModuleHttp()]
})
export class UserModule { }
