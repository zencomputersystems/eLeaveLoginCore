import { Injectable, HttpService } from '@nestjs/common';
import { BaseDBService } from '../common/base/base-db.service';
import { QueryParserService } from '../common/helper/query-parser-service';

/**
 * Auth db service tenant (check tenant subscription)
 *
 * @export
 * @class AuthDbService
 * @extends {BaseDBService}
 * @implements {IDbService}
 */
@Injectable()
export class AuthDbService extends BaseDBService {
  /**
   *Creates an instance of AuthDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof AuthDbService
   */
  constructor(
    public readonly httpService: HttpService,
    public readonly queryService: QueryParserService) {
    super(httpService, queryService, "tenant_subscription");
  }
}