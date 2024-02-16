import x from "testImport.g"
import y from "testImport.g"

const z = x + y;

print("Hello world!")
print(x, y, z)

class TestClass {
    public const ClassProp = "constant";
    public let otherClassProp = "mutable";
}
