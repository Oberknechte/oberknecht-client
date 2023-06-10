import { convertToArray } from "oberknecht-utils";
import { i } from "..";
import { _getUsersResponse } from "oberknecht-api/lib-ts/types/_getUsers";
import { userEntry } from "oberknecht-api/lib-ts/types/endpoints/_getUsers";

export async function getusers(
  sym: string,
  logins: string | string[] | undefined,
  ids: string | string[] | undefined,
  noautofilterids?: boolean
) {
  return new Promise<Array<userEntry>>((resolve, reject) => {
    if (!(ids ?? undefined) && !(logins ?? undefined))
      return reject(Error("No ids or users defined"));

    let users_ = convertToArray(logins, false);
    let ids_ = convertToArray(ids, false);

    i.OberknechtAPI[sym]
      ._getUsers(users_, ids_, noautofilterids)
      .then((u: _getUsersResponse) => {
        return resolve(Object.values(u.details));
      })
      .catch(reject);
  });
}
