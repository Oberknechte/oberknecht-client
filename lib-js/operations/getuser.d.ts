import { userEntry } from "oberknecht-api/lib-ts/types/endpoints/_getUsers";
export declare function getuser(sym: string, login: string | undefined, id: string | undefined, noautofilterids?: boolean): Promise<userEntry>;
