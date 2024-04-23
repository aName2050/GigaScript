import { createLocalServer } from 'node'

createLocalServer(func () {
    print('server created!')
}, 8000)
