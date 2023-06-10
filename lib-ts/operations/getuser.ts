import { _getUsersResponse } from "oberknecht-api/lib-ts/types/_getUsers";
import { userEntry } from "oberknecht-api/lib-ts/types/endpoints/_getUsers";
import { getusers } from "./getusers";

export async function getuser(
  sym: string,
  login: string | undefined,
  id: string | undefined,
  noautofilterids?: boolean
) {
  return new Promise<userEntry>((resolve, reject) => {
    getusers(sym, login, id, noautofilterids)
      .then((u) => {
        resolve(u[0]);
      })
      .catch(reject);
  });
}
