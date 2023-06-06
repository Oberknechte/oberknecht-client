import { convertToArray } from "oberknecht-utils";
import { i } from "..";
import { _getUsersResponse } from "oberknecht-api/lib-ts/types/_getUsers";

export async function getusers(sym: string, logins: string | string[] | undefined, ids: string | string[] | undefined, sendsingle?: boolean, noautofilterids?: boolean) {
    return new Promise((resolve, reject) => {
        if (!(ids ?? undefined) && !(logins ?? undefined)) return reject(Error("No ids or users defined"));

        let users_ = convertToArray(logins, false);
        let ids_ = convertToArray(ids, false);

        i.OberknechtAPI[sym]._getUsers(users_, ids_, noautofilterids)
            .then((u: _getUsersResponse) => {
                if ((sendsingle ?? undefined) && users_.length === 1) {
                    if (Object.keys(u?.logins)?.length == 0) return reject(Error("API didn't return any data on user"));

                    let ch = u?.details[Object.keys(u?.details)[Object.keys(u?.details).length - 1]];
                    return resolve(ch);
                } else {
                    return resolve(Object.values(u.details));
                };
            })
            .catch(reject);
    });
};