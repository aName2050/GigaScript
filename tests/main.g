import { Map } from 'gs:maps'

const map = new Map();

map.set('test', 32)
map.set('test2', 64)

print(map.get('test'))
print(map.get('test2'))

print(map.getAll())
