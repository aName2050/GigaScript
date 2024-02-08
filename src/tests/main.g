import x from "testImport.g"
import y from "testImport.g"

print("inside main.g!")

print(x, y)

let i = 10;

while(true){
    print("looping in while loop. currently have", i, "loops left")
    i = i - 1
}
