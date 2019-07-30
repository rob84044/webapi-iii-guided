const express = require('express'); // importing a CommonJS module
const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet')
const server = express();
const morgan = require('morgan')

server.use(morgan('dev'))
server.use(gateKeeper)
server.use(methodLogger)
server.use(express.json());
server.use('/api/hubs', hubsRouter);
server.use(helmet())
server.use(addName)

// server.use(lockout)


server.get('/', (req, res) => {
    const nameInsert = (req.name) ? ` ${req.name}` : '';

    res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
    console.log(`${req.method} request received`)
    next()
}

function addName(req, res, next) {
    console.log("adding name...")
    req.name = req.header("x-mycustomname");
    console.log(req.header("x-mycustomname"))
    next()
}

function gateKeeper(req, res, next) {
    const seconds = new Date().getSeconds()
    if (seconds % 3 === 0) {
        res.status(403).json({ message: "You are forbidden from accessing" })
    } else {
        next()
    }
}

// function lockout(req, res, next) {
//     res.status(403).json({ message: 'API Locked out!' })
// }

module.exports = server;