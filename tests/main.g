const obj = { x: 32, y: 64, complex: { arr: [1, 2, 3, 'a', 'b', 'c'], hello: 'world!', nested: { _string: 'nested object!' } } };
const test = GSON.toString(obj);

print(test)

print(GSON.toGSON(test))
