func makeAdder (offset) {

    func add (x, y) {
        x + y + offset
    }

    add
}

const adder = makeAdder(1);

print(adder(10, 5))