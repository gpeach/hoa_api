const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
require('dotenv').config()
const certOptions = {
    // key: fs.readFileSync("./localhost-key.pem"),
    // cert: fs.readFileSync("./localhost.pem"),

    key: fs.readFileSync("./10.0.0.200-key.pem"),
    cert: fs.readFileSync("./10.0.0.200.pem"),
};
const jwt = require('jsonwebtoken')
const cors = require('cors')
let app = express()
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let port = 3001
let ticket = require('./app/routes/Ticket')
let user = require('./app/routes/User')
let config = require('config')
const User = require("./app/models/User");
let options = {
    useNewUrlParser: true,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useUnifiedTopology: true,
    useCreateIndex: true
}

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The folder where you want to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // The filename for the uploaded file
    },
});

const upload = multer({ storage: storage });
mongoose.connect(process.env.DB_HOST, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))
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

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

app.get('/', (req, res) => res.json({message: "Welcome to the ticket api"}))
app.get('/tickets', verifyToken, ticket.getTickets)
app.post('/tickets', verifyToken, ticket.postTicket)
app.get('/tickets/:id', verifyToken, ticket.getTicket)
app.delete('/tickets/:id', verifyToken, ticket.deleteTicket)
app.put('/tickets/:id', verifyToken, ticket.updateTicket)
app.route('/user')

app.get('/users', verifyToken, user.getUsers)
app.post('/users', verifyToken, user.postUser)
app.get('/users/:id', verifyToken, user.getUser)
app.delete('/users/:id', verifyToken, user.deleteUser)
app.put('/users/:id', verifyToken, user.updateUser)

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User created' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post('/upload', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.status(200).send({ fileName: req.file.filename, fileLocation: req.file.path });
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send({error: 'Invalid email or password'});
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send({error: 'Invalid email or password'});
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).send({message: 'Login successful', token});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

app.listen(port)
console.log("listening on port: " + port)

// https.createServer(certOptions, app).listen(port, () => {
//     console.log('Server listening on port ' + port)
// })

module.exports = app