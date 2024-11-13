const test: object = {
    hello: {
        word: 'nested!',
        how: {
            nested: '?'
        }
    }
};

print(test)
print(test.hello.word)
print(test.hello['how'])
