func test(callback) {
    const x = 32;
    callback(x)
}

test(func (x) {
    print('hello from a callback function!')
    print(x)
})