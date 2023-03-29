const jsonsplitteroptions = {
    "child_folders_keys": Number() ?? 1,
    // > folder number before creating file
    // > higher numer = more subfolders (keynames) before single files
    // "store_keys_in_master": Boolean() ?? true,
    "debug": Number() ?? 2,
    "max_keys_in_file": Number() ?? 3000,
    // > keys of parent object are less then number create file
    "startpath": String() ?? "./data",
    "filechange_interval": Number() ?? 15000
};

module.exports = jsonsplitteroptions;