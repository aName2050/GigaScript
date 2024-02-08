import x from "testImport.g"
import y from "testImport.g"

print("inside main.g!")

print(x, y)

for(let i=0;i<10;i=i+1){
    if(i == 6) { continue }
    print(i)
}

let j = 0;

while(j < 10) {
    if(j == 6) { break }
    print(j)
    j = j + 1
}
