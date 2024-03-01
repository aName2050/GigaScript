class TestClass {
    public PublicProp;
    private PrivateProp = "you can't see me!";

    constructor(publicProp) {
        this.PublicProp = publicProp
    }

    public printPrivateProp() {
        print(this.PrivateProp)
    }

    public logPublicProp(logMessage) {
        print(logMessage, this.changeText(this.PublicProp))
    }

    private changeText(text){
        return text + " modified!";
    }
}

const test = new TestClass("hello world!");

test.printPrivateProp()
test.logPublicProp("logging...:")
