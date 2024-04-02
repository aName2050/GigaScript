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

print(obj)

print()
print('MODIFIED:')
print()

obj.x = 64
obj.complex.foo = "foo"
obj.complex.more = { test: "hello" }

print(obj)

print(obj.foo)
print(obj.more.test)