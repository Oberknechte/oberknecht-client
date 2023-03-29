const { oberknechtEmitter } = require("oberknecht-emitters");
const jsonsplitteroptions = require("../arguments/jsonsplitter.options");
const _mainpath = require("../functions/_mainpath");
const _cdir = require("../functions/_cdir");
const _wf = require("../functions/_wf");
const _chunkArray = require("../functions/_chunkArray");
const i = require("..");
const getmainpaths = require("../functions/getmainpaths");
const getmainfiles = require("../functions/getmainfiles");
const getpaths = require("../functions/getpaths");
const getfiles = require("../functions/getfiles");
const filechange = require("../handlers/filechange");
const _log = require("../functions/_log");
const fs = require("fs");
const slashreg = /^\/|\/$/g;
const _mainreg = /_main\.json$/g;

const onErrorcallback = /**@param {Error} error */ (error) => { };

class jsonsplitter {
    #symbol = Symbol();
    get symbol() { return this.#symbol; };

    oberknechtEmitter = new oberknechtEmitter();

    get _mainpaths() { return (i.splitterData[this.symbol]?.mainPaths ?? getmainpaths(this.symbol)); };
    get _mainfiles() { return (i.splitterData[this.symbol]?.mainFiles ?? getmainfiles(this.symbol)); };
    get _paths() { return (i.splitterData[this.symbol]?.paths ?? getpaths(this.symbol)); };
    get _files() { return (i.splitterData[this.symbol]?.files ?? getfiles(this.symbol)); };

    /** @param {jsonsplitteroptions} options */
    constructor(options) {
        if (!(options ?? undefined)) options = {};
        options.child_folders_keys = (options?.child_folders_keys ?? 1);
        options.max_keys_in_file = (options?.max_keys_in_file ?? 3000);
        options.startpath = (options?.startpath ? options.startpath.startsWith("/") ? options?.startpath : _mainpath(options.startpath) : _mainpath("./data"));
        _cdir(this.symbol, options.startpath);
        options.debug = (options.debug ?? 2);

        if (options.debug >= 0) _log(1, `[JSONSPLITTER] Directory: ${options.startpath}`);

        i.splitterData[this.symbol] = {
            actualFiles: {},
            actualMainFiles: {}
        };
        this._options = i.splitterData[this.symbol]._options = options;

        i.oberknechtEmitter[this.symbol] = this.oberknechtEmitter;

        // process.on("unhandledRejection", e => this.oberknechtEmitter.emitError("unhandledRejection", e));
        // process.on("uncaughtException", e => this.oberknechtEmitter.emitError("uncaughtException", e));

        getmainfiles(this.symbol);
        getfiles(this.symbol);

        i.splitterData[this.symbol].filechangeInterval = setInterval(() => { filechange(this.symbol) }, (options.filechange_interval ?? 15000));
    };

    /** @param {onErrorcallback} callback */
    onError = (callback) => {
        return this.oberknechtEmitter.on("error", callback);
    };

    emitError = (e) => {
        return this.oberknechtEmitter.emitError(e);
    };

    create = (object) => {
        return new Promise((resolve, reject) => {
            let objdir = this.getDirPathsByObject(object);
            objdir.forEach(obj => {
                _cdir(this.symbol, _mainpath(this.symbol, [...obj.path]));
                let objmainpath = _mainpath(this.symbol, [...obj.path, "_main.json"]);
                let objmain = {};
                let keychunks = _chunkArray(Object.keys(obj.object), this._options.max_keys_in_file);
                objmain.filenum = 0;
                objmain.filekeynum = 0;
                objmain.num = 0;
                objmain.keys = {};
                objmain.keynames = obj.path;
                if (keychunks.length === 0) _wf(this.symbol, _mainpath(this.symbol, [...obj.path, `0.json`]), this.createObjectFromKeys(obj.path, {}));
                keychunks.forEach((keychunk, i) => {
                    let keychunk_ = {};
                    objmain.num += keychunk.length;
                    objmain.filekeynum = keychunk.length;
                    objmain.filenum = i;
                    keychunk.forEach(a => {
                        keychunk_[a] = obj.object[a];
                        objmain.keys[a] = i;
                    });
                    let chunkfile = this.createObjectFromKeys(obj.path, keychunk_);
                    _wf(this.symbol, _mainpath(this.symbol, [...obj.path, `${i}.json`]), chunkfile);
                });

                _wf(this.symbol, objmainpath, objmain);
            });

            return resolve(objdir);
        });
    };

    destroy = async () => {
        return new Promise((resolve, reject) => {
            try {
                clearInterval(i.splitterData[this.symbol].filechangeInterval);
            } catch (e) { }

            delete i.splitterData[this.symbol];

            return resolve();
        });
    };

    getDirPathsByObject = (o, n1) => {
        function getDirPathByObject(o2, n, ml, p, ob) {
            if (((n >= ml) || Object.keys(o2).filter(a => typeof o2[a] !== "object").length > 0)) {
                ob._options.child_folders_keys = i.splitterData[ob.symbol]._options.child_folders_keys = n;
                return {
                    path: p,
                    object: o2
                };
            };

            const nn = n + 1;
            return Object.keys(o2).map(k3 => {
                const p2 = [...p, k3];
                return getDirPathByObject(o2[k3], nn, ml, p2, ob);
            });
        };
        return getDirPathByObject(o, 0, (n1 ?? this._options.child_folders_keys), [], this);
    };

    getDirPathsByKeys = (keypath) => {
        let dp = _mainpath(this.symbol, this.convertToArray(keypath).join("/"));
        let rp = dp.split(_mainpath(this.symbol))[1].replace(slashreg, "");
        return [
            dp,
            dp.split("/").slice(0, (dp.split("/").length - rp.split("/").length + 1)).join("/"),
            dp.split("/").slice((dp.split("/").length - rp.split("/").length + 1)).join("/"),
            dp.split("/").slice(0, (dp.split("/").length - rp.split("/").length + 1)).join("/") + "/_main.json",
        ];
    };

    createObjectFromKeys = (keys, value) => {
        let o = {};
        keys = this.convertToArray(keys);
        keys.forEach((a, i) => {
            if (i == keys.length - 1) o[a] = value; else o[a] = {};
        });
        return o;
    };

    addKeysToObject = async (object, keys, value) => {
        return new Promise((resolve, reject) => {
            keys = this.convertToArray(keys);

            let parentObj = object;
            for (let i = 0; i < (keys.length - 1); i++) {
                let key = keys[i];
                if (!(key in parentObj)) {
                    parentObj[key] = {};
                }

                parentObj = parentObj[key];
            };

            parentObj[keys[keys.length - 1]] = value;
            return resolve(object);
        });
    };

    getKeyFromObject = async (object, keys, noreject) => {
        return new Promise((resolve, reject) => {
            let value = object;
            for (let i = 0; i < keys.length; i++) {
                if (value.hasOwnProperty(keys[i])) {
                    value = value[keys[i]];
                } else {
                    let err = Error(`key ${keys[i]} not in value`);
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                }
            }
            return resolve(value);
        });
    };

    deleteKeyFromObject = async (object, keys, noreject) => {
        return new Promise((resolve, reject) => {
            let parentObj = object;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in parentObj)) {
                    this.emitError(`key ${keys[i]} not in object`);
                    if (noreject) return resolve(undefined);
                    return reject({ error: Error(`key ${keys[i]} not in object`) });
                } else {
                    parentObj = parentObj[keys[i]];
                };
            };
            let delkey = keys[keys.length - 1];
            delete parentObj[delkey];
            return resolve(object);
        });
    };

    getKeyArrayFromObject = (object) => {
        let r = [];
        function go(o2) {
            if (Object.keys(o2).length > 0) return;
            r.push(Object.keys(o2)[0]);
            go(o2[Object.keys(o2)[0]]);
        };
        go(object);
        return r;
    };

    convertToArray = (keys) => {
        if (!Array.isArray(keys)) return [keys];
        return keys;
    };

    getFileByKeys = async (keypath) => {
        return new Promise((resolve, reject) => {
            let r = { path: undefined, dirpath: undefined, dirpaths: undefined, path_main: undefined, object: undefined, object_main: undefined, keyfound: false, filenum: undefined };
            for (let i = 0; i < keypath.length; i++) {
                let dirpathkeys = this.getDirPathsByKeys(keypath.slice(0, i + 1));
                let filteredkeypath = Object.keys(this._mainpaths).filter(b => new RegExp(`^${dirpathkeys[1]}\/_main\.json`).test(b));
                if (filteredkeypath.length > 0) {
                    r.path_main = filteredkeypath[0];
                    r.object_main = this._mainfiles[r.path_main];
                    r.dirpath = dirpathkeys[1];
                    r.dirpaths = Object.keys(this._paths).filter(a => a.startsWith(r.dirpath));
                    r.filenum = r.object_main().filenum;
                    if ((r.object_main()?.keys?.[keypath[i + 1]] ?? undefined) !== undefined) {
                        r.filenum = r.object_main().keys[keypath[i + 1]];
                        r.keyfound = true;
                    } else {
                        r.keyfound = false;
                    };
                    r.path = r.path_main.replace(_mainreg, `${r.filenum}.json`);
                    r.object = this._files[r.path];
                    i = keypath.length;
                };
            };

            return resolve({
                get object() { return r.object?.() },
                get object_() { return r.object },
                get object_main() { return r.object_main?.() },
                get object_main_() { return r.object_main },
                get path() { return r.path },
                get path_main() { return r.path_main },
                get keys() { return keypath },
                dirpath: r.dirpath,
                dirpaths: r.dirpaths,
                keyfound: r.keyfound,
                filenum: r.filenum
            });
        });
    };

    getMainPath = (keypath) => {
        let keypath_ = this.convertToArray(keypath);
        return _mainpath(this.symbol, [...keypath_.slice(0, (keypath_.length > this._options.max_keys_in_file ? this._options.max_keys_in_file : keypath_.length - 1)), "_main.json"]);
    };

    getMainKey = async (keypath, noreject) => {
        return new Promise(async (resolve, reject) => {
            let objpath = await this.getFileByKeys(keypath);

            if (!objpath.object_main) {
                let err = Error(`objpath.object_main is undefined (keypath: ${keypath}, noreject: ${noreject})`);
                this.emitError(err);
                if (noreject) return resolve(undefined);
                return reject(err);
            };

            this.getKeyFromObject(objpath.object_main, keypath.slice(1))
                .then(mainkey => {
                    return resolve(mainkey);
                })
                .catch(e => {
                    let err = Error(`could not get key ${keypath[keypath.length - 1]} from mainfile keys (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                })
        });
    };

    getKey = async (keypath, noreject) => {
        return new Promise(async (resolve, reject) => {
            let keypath_ = this.convertToArray(keypath);
            let objpath = await this.getFileByKeys(keypath_);

            if (keypath_.length > 1) {
                if (!objpath.keyfound) {
                    let err = Error(`objpath.keyfound is false (keypath: ${keypath_}, noreject: ${noreject})`);
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                };

                this.getKeyFromObject(objpath.object, keypath_, noreject)
                    .then(resolve)
                    .catch(e => {
                        let err = Error(`could not get key (path = keypath) from file (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                        this.emitError(err);
                        if (noreject) return resolve(undefined);
                        return reject(err);
                    });
            } else {
                if (!objpath.object_main) {
                    let err = Error(`objpath.object_main is undefined (keypath: ${keypath_}, noreject: ${noreject})`);
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                };

                let r = {};
                Promise.all([...Array((objpath.filenum ?? 0) + 1)].map(async (a, i) => {
                    let file = this._files[objpath.path_main.replace(_mainreg, `${i}.json`)]();
                    let objects = await this.getKeyFromObject(file, keypath_);
                    r = { ...r, ...objects };
                }))
                    .finally(() => {
                        return resolve(r);
                    });
            };
        });
    };

    addKey = async (keypath, value, noreject) => {
        return new Promise(async (resolve, reject) => {
            let keypath_ = this.convertToArray(keypath);
            let objpath = await this.getFileByKeys(keypath_);

            if (!objpath.object_main) {
                // let err = Error(`objpath.object_main is undefined (keypath: ${keypath}, noreject: ${noreject})`);
                // this.emitError(err);
                // if (noreject) return resolve(undefined);
                // return reject(err);
                await this.create(await this.addKeysToObject({}, keypath_, value));
            };

            getmainpaths(this.symbol);
            getmainfiles(this.symbol);

            objpath = await this.getFileByKeys(keypath_);

            let mainpath = objpath.path_main;
            let filepath = objpath.path;

            let file = objpath.object_;

            if (objpath.object_main.filekeynum == (objpath.object_main.keynames.length + 1)) {
                if (objpath.object_main.filekeynum >= this._options.max_keys_in_file) {
                    objpath.object_main.filenum++;
                    objpath.object_main.filekeynum = 0;

                    filepath = objpath.path_main.replace(_mainreg, `${objpath.object_main.filenum}.json`);
                    i.splitterData[this.symbol].paths[filepath] = filepath.replace(_mainpath(this.symbol), "").replace(slashreg, "");

                    _wf(this.symbol, filepath, this.createObjectFromKeys(objpath.object_main.keynames, {}));
                    file = this._files[filepath];

                    if (!objpath.object_main.hasChanges) objpath.object_main.hasChanges = [];
                    if (!objpath.object_main.hasChanges.includes(filepath)) objpath.object_main.hasChanges.push(filepath);
                    objpath.object_main.hasChanges.push(filepath);

                    i.splitterData[this.symbol].actualMainFiles[mainpath] = objpath.object_main;
                };

                objpath.object_main.num++;
                objpath.object_main.filekeynum++;
            };

            this.addKeysToObject(objpath.object_main, ["keys", objpath.keys[1]], objpath.object_main.filenum)
                .then(newmainfile => {
                    this.addKeysToObject(file(), keypath_, value)
                        .then(async newfile => {
                            i.splitterData[this.symbol].actualFiles[filepath] = newfile;

                            if (!newmainfile.hasChanges) newmainfile.hasChanges = [];
                            if (!newmainfile.hasChanges.includes(filepath)) newmainfile.hasChanges.push(filepath);
                            i.splitterData[this.symbol].actualMainFiles[mainpath] = newmainfile;

                            return resolve(newfile);
                        })
                        .catch(e => {
                            let err = Error(`could not add key (path = keypath) to file (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                            this.emitError(err);
                            if (noreject) return resolve(undefined);
                            return reject(err);
                        })

                })
                .catch(e => {
                    let err = Error(`could not add key ${objpath.keys[1]} to mainfile keys (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                })

        });
    };

    editKey = async (keypath, value, noreject) => {
        return new Promise(async (resolve, reject) => {
            let keypath_ = this.convertToArray(keypath);
            let objpath = await this.getFileByKeys(keypath_);

            if (!objpath.keyfound) {
                let err = Error(`objpath.keyfound is false (keypath: ${keypath}, noreject: ${noreject})`);
                this.emitError(err);
                if (noreject) return resolve(undefined);
                return reject(err);
            };

            let mainpath = objpath.path_main;
            let filepath = objpath.path;

            if (!objpath.object) {
                let err = Error(`file is undefined - could not get key from mainobject keys (keypath: ${keypath}, noreject: ${noreject})`);
                this.emitError(err);
                if (noreject) return resolve(undefined);
                return reject(err);
            };

            this.addKeysToObject(objpath.object, keypath_, value)
                .then(newfile => {
                    i.splitterData[this.symbol].actualFiles[filepath] = newfile;
                    if (!objpath.object_main.hasChanges) objpath.object_main.hasChanges = [];
                    if (!objpath.object_main.hasChanges.includes(filepath)) objpath.object_main.hasChanges.push(filepath);
                    i.splitterData[this.symbol].actualMainFiles[mainpath] = objpath.object_main;

                    return resolve(newfile);
                })
                .catch(e => {
                    let err = Error(`could not add key (path: ${keypath_.slice(0, keypath_.length - 2)}) to object (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                });
        });
    };

    deleteKey = async (keypath, noreject) => {
        return new Promise(async (resolve, reject) => {
            let keypath_ = this.convertToArray(keypath);
            let objpath = await this.getFileByKeys(keypath_);

            if (!objpath.object_main) {
                let err = Error(`objpath.object_main is undefined (keypath: ${keypath_}, noreject: ${noreject})`);
                this.emitError(err);
                if (noreject) return resolve(undefined);
                return reject(err);
            };

            let mainpath = objpath.path_main;

            let filepath = objpath.path_main.replace(_mainreg, `${objpath.filenum}.json`);
            let file = objpath.object;

            if (keypath_.length > (objpath.object_main?.keynames?.length ?? i.splitterData[this.symbol].max_keys_in_file)) {
                await this.deleteKeyFromObject(file, keypath)
                    .then(newfile => {
                        file = i.splitterData[this.symbol].actualFiles[filepath] = newfile;

                        let mainfile = objpath.object_main;
                        if (!mainfile.hasChanges) mainfile.hasChanges = [];
                        if (!mainfile.hasChanges.includes(filepath)) mainfile.hasChanges.push(filepath);
                        i.splitterData[this.symbol].actualMainFiles[mainpath] = mainfile;

                        return resolve(file);
                    })
                    .catch(e => {
                        let err = Error(`could not delete key from file (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                        this.emitError(err);
                        if (noreject) return resolve(undefined);
                        return reject(err);
                    });
            } else {
                if (!objpath.dirpath) {
                    let err = Error(`could not get maindirectory of specified keypath (keypath: ${keypath}, noreject: ${noreject})`, { "cause": e });
                    this.emitError(err);
                    if (noreject) return resolve(undefined);
                    return reject(err);
                };

                try {
                    delete i.splitterData[this.symbol].actualMainFiles[objpath.path_main];
                } catch (e) { }

                Object.keys(objpath.dirpaths).forEach(a => {
                    try {
                        delete i.splitterData[this.symbol].actualFiles[a];
                    } catch (e) { }
                });

                fs.rmSync(objpath.dirpath, { recursive: true });
            };
        });
    };
};

module.exports = jsonsplitter;