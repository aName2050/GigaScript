export const MODULE_NAME = 'json';

export func toString(obj) {
    return GSON.toString(obj);
}

export func toJSON(str) {
    return GSON.toGSON(str);
}
