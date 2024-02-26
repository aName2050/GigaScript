import x from "testImport.g"
import y from "testImport.g"

const z = x + y;

print("Hello world!")
print(x, y, z)

class TestClass {
    public ClassProp = "variable";
    private otherClassProp = "mutable";

    public Method(param) {
        print(param)
    }
}
