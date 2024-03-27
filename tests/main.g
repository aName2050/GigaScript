const test = 100;
let string = "hello!";

func add(a, b) {
    return a + b;
}

print(add(1, 2))

const obj = {
    x: 32,
    string,
    complex: {
        foo: "bar"
    }
};

print(obj.x)
print(obj.string)
print(obj.complex.foo)

try {
    print("hello world!")
} catch (e) {
    print(e)
}
