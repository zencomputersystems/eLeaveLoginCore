//  ---------------------------------------------------------------------------------------------------------------------------

import { HttpModule } from "@nestjs/common";
import { DreamFactory } from "../../config/dreamfactory";

/**
 * Declare httpmodule
 */
const baseModule = HttpModule.register({ headers: { 'Content-Type': 'application/json', 'X-Dreamfactory-API-Key': DreamFactory.df_key } });

/**
 * Return http module
 *
 * @export
 * @returns
 */
export function getModuleHttp() {
  return baseModule;
}

//  ---------------------------------------------------------------------------------------------------------------------------

/**
 * Run service callback
 *
 * @export
 * @param {*} method
 * @returns
 */
export async function runServiceCallback(method) {
  const cbService = () => {
    return new Promise((resolve, reject) => {
      method.subscribe(
        data => {
          resolve(data);
        }, err => {
          return reject(err);
        }
      )
    })
  }
  return await cbService();
}