const foo = 50 / 2;

const obj = {
    x: 100,
    y: 32,
    foo,
    complex: {
        bar: true,
    },
};

let f = obj.complex.bar;
foo = obj.foo + 5;
