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
}

const test = new TestClass("this value was defined later!");

"print('this should result in an error:', test.privateProp)"
"print('this should result in an error:', test.constPrivateProp)"
"print('this should result in an error:')"
"test.privateMethod()"

print(test.publicProp)
print(test.constPublicProp)
test.publicMethod()

print(this)
