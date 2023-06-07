import { userEntry } from "oberknecht-api/lib-ts/types/endpoints/_getUsers";
export declare function getusers(sym: string, logins: string | string[] | undefined, ids: string | string[] | undefined, noautofilterids?: boolean): Promise<userEntry[]>;
