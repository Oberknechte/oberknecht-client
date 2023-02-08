const i = require("../index");

class urls {
    static twitch = class {
        static _base = "https://api.twitch.tv/helix/";
        static _headers = (sym) => {
            let r = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${i.clientData[sym]?._options?.requesttoken ?? i.clientData[sym]?._options?.token}`,
            };
            if(i.clientData[sym]?._options?.clientid) r["Client-ID"] = i.clientData[sym]?._options?.clientid;
            return r;
        };
        static whispers = {
            "method": "POST",
            "query": ["from_user_id", "to_user_id"],
            "body": ["message"],
            "code": 204
        };
        static users = {
            "query": ["id", "login"],
        };
    };

    static _ = (...args) => {
        let o = this[args[0]];
        [...args].slice(1).forEach(a => {
            o = o[a];
        });
        return o;
    };

    static _url = (...args2) => {
        let args = [...(!Array.isArray(args2) ? [args2] : args2)];
        if(!this[args[0]]) args.unshift("twitch");
        return (!/^https:\/{2}/g.test(args[0]) ? this[args[0]]._base : args[0]) + args.slice(1).join("/");
    };

    static _code = (...args2) => {
        return this._(...args2).code ?? 200;
    };
};

module.exports = urls;