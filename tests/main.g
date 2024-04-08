let string = "hello!";
const obj = {
    x: 32,
    string,
    complex: {
        foo: "bar",
        more: {
            advanced: 'cool'
        }
    }
};

print('unmodified', obj)

print()
print('MODIFIED:')
print()

obj.x = 64
obj.string = "changed!?"

obj.complex.foo = 'foo'

obj.complex.more = { different: "this is different" }

print('modified', obj)

