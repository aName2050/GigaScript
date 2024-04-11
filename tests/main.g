class TestClass {
    private privateProp = "this is a private prop";
    public publicProp = "this is a public prop";

    private static constPrivateProp = "this is a constant (static) private prop";
    public static constPublicProp = "this is a constant (static) public prop";

    public definedLater;

    constructor(value) {
        this.definedLater = value
    }

    public publicMethod() {
        print("this is a public method")
    }

    private privateMethod() {
        print("this is a private method")
    }

    public dump(text) {
        print(text)
        print(this)
    }
}

const test = new TestClass("this value was defined later!");

print(test.publicProp)
print(test.constPublicProp)
test.publicMethod()

print('outside class')
print(this)

test.dump('inside class')
