import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoleDbService } from "../common/db/table.db.service";

@Injectable()
export class RoleService {
  constructor(public readonly roleDbService: RoleDbService) { }

  public findAll(roleProfileId: string): Observable<any> {
    const fields = ['PROPERTIES_XML'];
    const filters = ['(ROLE_GUID=' + roleProfileId + ')'];
    return this.roleDbService.findByFilterV2(fields, filters);
  }

}