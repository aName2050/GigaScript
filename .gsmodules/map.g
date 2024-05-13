export const MODULE_NAME = 'gs:maps';

export class Map {
    private object = {};

    public set(k, v) {
        this.object[k] = v
        return v;
    }

    public get(k) {
        return this.object[k];
    }

    public getAll() {
        return this.object;
    }
}
