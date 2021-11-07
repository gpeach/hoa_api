const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const certOptions = {
    // key: fs.readFileSync("./localhost-key.pem"),
    // cert: fs.readFileSync("./localhost.pem"),

    key: fs.readFileSync("./10.0.0.200-key.pem"),
    cert: fs.readFileSync("./10.0.0.200.pem"),
};
const cors = require('cors')
let app = express()
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let port = 3001
let ticket = require('./app/routes/ticket')
let config = require('config')
let options = {
    useNewUrlParser: true,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useUnifiedTopology: true
}
mongoose.connect(config.DBHost, options)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))
app.use(cors())
app.get('/', (req, res) => res.json({message: "Welcome to the ticket api"}))
app.route('/tickets')
.get(ticket.getTickets)
app.route('/tickets')
.post(ticket.postTicket)
app.route("/tickets/:id")
.get(ticket.getTicket)
.delete(ticket.deleteTicket)
.put(ticket.updateTicket)


app.listen(port)
console.log("listening on port: " + port)

// https.createServer(certOptions, app).listen(port, () => {
//     console.log('Server listening on port ' + port)
// })

module.exports = app