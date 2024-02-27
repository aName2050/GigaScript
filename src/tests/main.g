class TestClass {
    public ClassProp = 2 + 2;
    private otherClassProp = "this not visible when calling 'new TestClass()'";

    public Method(param) {
        print("inside public class method")
        print("param passed:")
        print(param)
    }
}

let test = new TestClass();
print(test.ClassProp)
test.Method("64")
