import { userEntry } from "oberknecht-api/lib-ts/types/endpoints/_getUsers";
export declare function getuser(sym: string, logins: string | string[] | undefined, ids: string | string[] | undefined, sendsingle?: boolean, noautofilterids?: boolean): Promise<userEntry>;
