import { i } from "..";

export async function _getclientid(sym: string, customtoken: string) {
    return new Promise<string>((resolve, reject) => {
        if (!(sym ?? undefined) || !(customtoken ?? undefined)) return reject(Error("sym or customtoken is undefined"));

        i.OberknechtAPI[sym]._validatetoken(customtoken)
            .then(dat => {
                if (dat.client_id && i.clientData[sym]) {
                    i.clientData[sym]._options = {
                        ...i.clientData[sym]._options,
                        clientid: dat.client_id,
                        userid: dat.user_id,
                        username: dat.login,
                        token_scopes: dat.scopes
                    };
                };

                resolve(dat.client_id);
            })
            .catch(reject);
    });
};