let start = timestamp();
for(let i=0;i<1000;i=i+1){
    for(let j=0;j<1000;j=j+1){
        let z = i + j;
        print(z)
    }
}
print("took", timestamp() - start, "ms")