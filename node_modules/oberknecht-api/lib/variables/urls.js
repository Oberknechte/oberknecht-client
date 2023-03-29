const i = require("../index");

class urls {
    static twitch = class {
        static _base = "https://api.twitch.tv/helix";
        static _headers = (sym, customtoken, customclientid) => {
            let r = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${customtoken ?? i.apiclientData[sym]?._options?.requesttoken ?? i.apiclientData[sym]?._options?.token}`,
            };
            if(customclientid ?? i.apiclientData[sym]?._options?.clientid) r["Client-ID"] = customclientid ?? i.apiclientData[sym]?._options?.clientid;
            return r;
        };

        static whispers = {
            endpoint: "/whispers",
            method: "POST",
            code: 204
        };

        static users = {
            endpoint: "/users",
        };
        
        static streams = {
            endpoint: "/streams",
        };

        static shoutouts = {
            endpoint: "/chat/shoutouts",
            method: "POST",
            code: 204
        };

        static bans = {
            endpoint: "/moderation/bans",
            method: "POST"
        };

        static unban = {
            endpoint: "/moderation/bans",
            method: "DELETE",
            code: 204
        };

        static deletemessage = {
            endpoint: "/moderation/chat",
            method: "DELETE",
            code: 204
        };

        static announcement = {
            endpoint: "/chat/announcements",
            method: "POST",
            code: 204
        };

        static updatechatsettings = {
            endpoint: "/chat/settings",
            method: "PATCH"
        };
        
        static getchatsettings = {
            endpoint: "/chat/settings",
            method: "GET"
        };

        static mod = {
            endpoint: "/moderation/moderators",
            method: "POST",
            code: 204
        };
        
        static unmod = {
            endpoint: "/moderation/moderators",
            method: "DELETE",
            code: 204
        };

        static vip = {
            endpoint: "/channels/vips",
            method: "POST",
            code: 204
        };
        
        static unvip = {
            endpoint: "/channels/vips",
            method: "DELETE",
            code: 204
        };

        static updatecolor = {
            endpoint: "/chat/color",
            method: "PUT",
            code: 204
        };
        
        static getcolor = {
            endpoint: "/chat/color",
        };

        static raid = {
            endpoint: "/raids",
            method: "POST"
        };
        
        static cancelraid = {
            endpoint: "/raids",
            method: "DELETE",
            code: 204
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
        return (!/^https:\/{2}/g.test(args[0]) ? this[args[0]]._base : args[0]) + (this._(...args)?.endpoint ?? args2.join("/"));
    };

    static _code = (...args2) => {
        return this._(...args2).code ?? 200;
    };
};

module.exports = urls;