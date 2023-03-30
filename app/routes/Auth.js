const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ticket = require("./Ticket");
const router = express.Router();
app.post('/tickets', verifyToken, ticket.postTicket)
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User created' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
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