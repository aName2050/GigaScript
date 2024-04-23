import { createLocalServer } from 'node'

createLocalServer(func (req, res) {
    res.write('hello world from gigascript!')
    res.end()
    print('new request!')
}, 8000)
