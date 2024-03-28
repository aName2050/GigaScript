let string = "hello!";
const obj = {
    x: 32,
    string,
    complex: {
        foo: "bar",
        more: {
            advanced: 'hello'
        }
    }
};

print(obj.x)
print(obj.complex.foo)
print(obj.complex.more.advanced)
