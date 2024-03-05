class TestClass {
    public PublicProp;
    private PrivateProp = "you can't see me!";

    constructor(publicProp) {
        print("constructing...", publicProp)
    }

    public printPrivateProp() {
        print(PrivateProp)
    }

    public logPublicProp(logMessage) {
        print(logMessage, PublicProp)
    }

}

const test = new TestClass("hello world!");

test.printPrivateProp()
test.logPublicProp("logging...:")
