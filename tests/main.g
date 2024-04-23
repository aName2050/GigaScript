import { createLocalServer } from 'node'

createLocalServer(func (req, res) {
    print('server created!')
}, 8000)
