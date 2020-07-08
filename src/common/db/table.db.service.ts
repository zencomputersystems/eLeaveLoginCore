import { Injectable, HttpService } from "@nestjs/common";
import { BaseDBService } from "../base/base-db.service";
import { QueryParserService } from "../helper/query-parser-service";

@Injectable()
export class AuthDbService extends BaseDBService {
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "tenant_subscription") }
}

@Injectable()
export class UserprofileDbService extends BaseDBService {
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_view_user_profile_list") }
}

@Injectable()
export class UserDbService extends BaseDBService {
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "user_main") }
}

@Injectable()
export class RoleDbService extends BaseDBService {
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_role_profile") }
}

@Injectable()
export class ProfileDefaultDbService extends BaseDBService {
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_profile_default") }
}
