import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { QueryParserService } from '../common/helper/query-parser-service';
import { getModuleHttp } from '../common/helper/basic-function';

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
    QueryParserService
  ],
  imports: [getModuleHttp()]
})
export class UserModule { }
