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

print(obj.x)
print(obj.complex.foo)
print(obj.complex.more.advanced)

print()
print('MODIFIED:')
print()

obj.x = 64
obj.complex.foo = "foo"
obj.complex.more.word = "hello world!"

print(obj.x)
print(obj.complex.foo)
print(obj.complex.more.word)
