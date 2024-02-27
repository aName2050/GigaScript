class TestClass {
    public ClassProp = "thisIsAVariable";
    private otherClassProp = "thisIsMutable";

    public Method(param) {
        print("inside public class method")
        print("param passed:")
        print(param)
    }
}

let test = new TestClass();
