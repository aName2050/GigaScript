import { createLocalServer } from 'node'

createLocalServer(function callback(req, res) {
    print('server created!')
}, 8000)
