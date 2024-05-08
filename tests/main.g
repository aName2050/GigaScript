import { Set } from 'gs:sets'

const set = new Set();

set.add(3)
set.add(3)
set.add(4)

print(set.getAll())

print(set.has(3))
print(set.has(5))
