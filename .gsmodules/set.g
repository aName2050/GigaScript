export const MODULE_NAME = 'gs:sets';

export class Set {
    private arr = [];

    public add(v) {
        if (Array.has(this.arr, v)) {
            return undefined;
        } else {
            Array.push(this.arr, v)
        }
    }

    public has(v) {
        let hasValue = false;

        for (let i = 0; i < )
    }

    public getAll() {
        return this.arr;
    }
}
